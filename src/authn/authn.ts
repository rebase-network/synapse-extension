import { stringToArrayBuffer, logVariable, arrayBufferToString, base64encode } from './utils';
import { getChallengeFido, makeCredential } from './fido';

/**
 * Retrieves a challenge from the server
 * @returns {Promise} Promise resolving to a ArrayBuffer challenge
 */
export function getChallenge() {
  const challengeFido = getChallengeFido();
  const challenge = stringToArrayBuffer(challengeFido);
  return Promise.resolve(challenge);
}

/**
 * Calls the .create() webauthn APIs and sends returns to server
 * @param {ArrayBuffer} challenge challenge to use
 * @return {any} server response object
 * https://obeta.me/posts/2019-03-01/WebAuthn%E4%BB%8B%E7%BB%8D%E4%B8%8E%E4%BD%BF%E7%94%A8
 * 1- 用户输入用户名点击注册按钮，客户端立即 Post 一个请求到服务器
 * 2- 服务器生成一个随机的字符串 challenge 与一个 userId，组装成下面的数据格式发送到客户端
 */
export function createCredential(challenge) {
  if (
    !PublicKeyCredential ||
    typeof PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable !== 'function'
  )
    // eslint-disable-next-line prefer-promise-reject-errors
    return Promise.reject('WebAuthn APIs are not available on this user agent.');

  // var attachment = $("input[name='attachment']:checked").val();

  const createCredentialOptions = {
    rp: {
      name: 'WebAuthn Sample App',
      //   icon: 'https://example.com/rpIcon.png',
    },
    user: {
      id: stringToArrayBuffer('some.user.id'), // userId, 需要转换为TypedArray,也就是Unit8Array
      name: 'bob.smith@contoso.com',
      displayName: 'Bob Smith',
      // icon: "https://example.com/userIcon.png"
    },
    pubKeyCredParams: [
      {
        // External authenticators support the ES256 algorithm // ES256 加密
        type: 'public-key',
        alg: -7,
      } as PublicKeyCredentialParameters,
      {
        // Windows Hello supports the RS256 algorithm // RS256 加密
        type: 'public-key',
        alg: -257,
      } as PublicKeyCredentialParameters,
    ],
    authenticatorSelection: {
      // Select authenticators that support username-less flows
      // 是否支持无密码注册登录（注意目前阶段大部分手机设备不支持，因此使用手机注册登录会设置为false）
      requireResidentKey: true,
      // Select authenticators that have a second factor (e.g. PIN, Bio)
      userVerification: 'required' as UserVerificationRequirement,
      // Selects between bound or detachable authenticators
      authenticatorAttachment: 'platform' as AuthenticatorAttachment,
    },
    // Since Edge shows UI, it is better to select larger timeout values
    timeout: 50000,
    // an opaque challenge that the authenticator signs over
    challenge,
    // prevent re-registration by specifying existing credentials here
    excludeCredentials: [],
    // specifies whether you need an attestation statement
    attestation: 'direct' as AttestationConveyancePreference,
  };

  // 然后浏览器会提示用户需要进行验证，并提供多种方式给用户选择，待用户选择相应的验证方式后
  // Authenticator 通过请求用户进行验证(按下按钮或者使用设备上的 pin、生物特征等)，验证完成后，
  // Authenticator 生成一个公钥-私钥对，并存储私钥，用户信息，以及域名。
  // 之后再使用私钥对 challenge 进行签名，并将数据返回给客户端(包括 crediID，publicKey，签名).
  //  - challenge 只需要临时存储，并且每次都随机生成，一般我们保存到 cookie 或者 session 中，待验证过后就把它删掉
  return navigator.credentials
    .create({
      publicKey: createCredentialOptions,
    })
    .then(async (rawAttestation: PublicKeyCredential) => {
      const rawReponse = rawAttestation.response as AuthenticatorAttestationResponse;
      const attestation = {
        id: base64encode(rawAttestation.rawId),
        clientDataJSON: arrayBufferToString(rawReponse.clientDataJSON),
        attestationObject: base64encode(rawReponse.attestationObject),
      };

      console.log('=== Attestation response ===');
      logVariable('id (base64)', attestation.id);
      logVariable('clientDataJSON', attestation.clientDataJSON);
      logVariable('attestationObject (base64)', attestation.attestationObject);
      // id (base64): AZghJb1RxSsh01lHDZW4ZH/KnydbIw7v3SeK7sKy5zelBerLdxvXh1kyaY/Wn5xQHLVzW+uhUWguU9xfuTXYMJE6LOxz2B+GV+nc0g==
      // clientDataJSON: {"type":"webauthn.create","challenge":"ZXlKaGJHY2lPaUpJVXpJMU5pSXNJblI1Y0NJNklrcFhWQ0o5LmV5SnBZWFFpT2pFMU9UYzROVEF5TlRjc0ltVjRjQ0k2TVRVNU56azNNREkxTjMwLnUyQzl0TG1xMTI3eW8wakM5WnJSRWJpa2FaQTl3WkZxZ29DNzJ6X2FCMDQ","origin":"http://localhost:3000","crossOrigin":false,"extra_keys_may_be_added_here":"do not compare clientDataJSON against a template. See https://goo.gl/yabPex"}
      // attestationObject (base64): o2NmbXRkbm9uZWdhdHRTdG10oGhhdXRoRGF0YVjQSZYN5YgOjGh0NBcPZHZgW4/krrmihjLHmVzzuoMdl2NFXz1Ck63OAAI1vMYKZIsLJfHwVQMATAGYISW9UcUrIdNZRw2VuGR/yp8nWyMO790niu7Csuc3pQXqy3cb14dZMmmP1p+cUBy1c1vroVFoLlPcX7k12DCROizsc9gfhlfp3NKlAQIDJiABIVggKyfE43I/WXOVgfFEW0rBEvJAH8CtVsBVKug4VG5/9YciWCBmpwCbSrxMjjp/LOjo5k9mYo/1hha+XObWIKCq8tz58Q==
      // return rest_put('/credentials', attestation);

      await makeCredential(attestation);

      return null;
    })
    .then((response) => {
      if (response.error) {
        return Promise.reject(response.error);
      }
      return Promise.resolve(response.result);
    });
}
