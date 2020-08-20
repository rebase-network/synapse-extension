import jwt from 'jsonwebtoken';
import { Base64 } from 'js-base64';
import base64url from 'base64url';
import cbor from 'cbor';
import uuid from 'uuid-parse';

const url = require('url');

const crypto = require('crypto');

const hostname = process.env.HOSTNAME || 'localhost';
const jwtSecret = process.env.JWT_SECRET || 'defaultsecret';

let credentialObj = {};

export function getChallengeFido() {
  return jwt.sign({}, jwtSecret, {
    expiresIn: 120 * 1000,
  });
}

/**
 * Evaluates the sha256 hash of a buffer
 * @param {Buffer} data
 * @returns sha256 of the input data
 */
const sha256 = (data) => {
  const hash = crypto.createHash('sha256');
  hash.update(data);
  return hash.digest();
};

/**
 * Converts a COSE key to a JWK
 * @param {Buffer} cose Buffer containing COSE key data
 * @returns {any} JWK object
 */
const coseToJwk = (cose) => {
  try {
    let publicKeyJwk = {};
    const publicKeyCbor = cbor.decodeFirstSync(cose);

    if (publicKeyCbor.get(3) === -7) {
      publicKeyJwk = {
        kty: 'EC',
        crv: 'P-256',
        x: publicKeyCbor.get(-2).toString('base64'),
        y: publicKeyCbor.get(-3).toString('base64'),
      };
    } else if (publicKeyCbor.get(3) === -257) {
      publicKeyJwk = {
        kty: 'RSA',
        n: publicKeyCbor.get(-1).toString('base64'),
        e: publicKeyCbor.get(-2).toString('base64'),
      };
    } else {
      throw new Error('Unknown public key algorithm');
    }

    return publicKeyJwk;
  } catch (e) {
    throw new Error('Could not decode COSE Key');
  }
};

/**
 * Validates CollectedClientData
 * @param {any} clientData JSON parsed client data object received from client
 * @param {string} type Operation type: webauthn.create or webauthn.get
 */
export const validateClientData = (clientData, type) => {
  if (clientData.type !== type)
    throw new Error(`collectedClientData type was expected to be ${type}`);

  let origin;
  try {
    origin = url.parse(clientData.origin);
  } catch (e) {
    throw new Error('Invalid origin in collectedClientData');
  }

  // chrome插件不需要对https和localhost进行验证
  //   if (origin.hostname !== hostname)
  //     throw new Error(`Invalid origin in collectedClientData. Expected hostname ${hostname}`);

  //   if (hostname !== 'localhost' && origin.protocol !== 'https:')
  //     throw new Error('Invalid origin in collectedClientData. Expected HTTPS protocol.');

  let decodedChallenge;
  try {
    decodedChallenge = jwt.verify(base64url.decode(clientData.challenge), jwtSecret);
    return decodedChallenge;
  } catch (err) {
    throw new Error('Invalid challenge in collectedClientData');
  }
};

/**
 * Parses authData buffer and returns an authenticator data object
 * @param {Buffer} authData
 * @returns {AuthenticatorData} Parsed AuthenticatorData object
 * @typedef {Object} AuthenticatorData
 * @property {Buffer} rpIdHash
 * @property {number} flags
 * @property {number} signCount
 * @property {AttestedCredentialData} attestedCredentialData
 * @property {string} extensionData
 * @typedef {Object} AttestedCredentialData
 * @property {string} aaguid
 * @property {any} publicKeyJwk
 * @property {string} credentialId
 * @property {number} credentialIdLength
 */
const parseAuthenticatorData = (authData) => {
  try {
    const authenticatorData = {
      rpIdHash: '',
      flags: null,
      signCount: 0,
      attestedCredentialData: {
        aaguid: '',
        credentialIdLength: 0,
        credentialId: '',
        publicKeyJwk: {},
      },
      extensionData: '',
    };

    authenticatorData.rpIdHash = authData.slice(0, 32);
    // eslint-disable-next-line prefer-destructuring
    authenticatorData.flags = authData[32];
    authenticatorData.signCount =
      // eslint-disable-next-line no-bitwise
      (authData[33] << 24) | (authData[34] << 16) | (authData[35] << 8) | authData[36];

    // eslint-disable-next-line no-bitwise
    if (authenticatorData.flags & 64) {
      const attestedCredentialData = {
        aaguid: '',
        credentialIdLength: 0,
        credentialId: '',
        publicKeyJwk: {},
      };
      attestedCredentialData.aaguid = uuid.unparse(authData.slice(37, 53)).toUpperCase();
      // eslint-disable-next-line no-bitwise
      attestedCredentialData.credentialIdLength = (authData[53] << 8) | authData[54];
      attestedCredentialData.credentialId = authData.slice(
        55,
        55 + attestedCredentialData.credentialIdLength,
      );
      // Public key is the first CBOR element of the remaining buffer
      const publicKeyCoseBuffer = authData.slice(
        55 + attestedCredentialData.credentialIdLength,
        authData.length,
      );

      // convert public key to JWK for storage
      attestedCredentialData.publicKeyJwk = coseToJwk(publicKeyCoseBuffer);

      authenticatorData.attestedCredentialData = attestedCredentialData;
    }

    // eslint-disable-next-line no-bitwise
    if (authenticatorData.flags & 128) {
      // has extension data

      let extensionDataCbor;

      if (authenticatorData.attestedCredentialData) {
        // if we have attesttestedCredentialData, then extension data is
        // the second element
        extensionDataCbor = cbor.decodeAllSync(
          authData.slice(
            55 + authenticatorData.attestedCredentialData.credentialIdLength,
            authData.length,
          ),
        );
        // eslint-disable-next-line prefer-destructuring
        extensionDataCbor = extensionDataCbor[1];
      } else {
        // Else it's the first element
        extensionDataCbor = cbor.decodeFirstSync(authData.slice(37, authData.length));
      }

      authenticatorData.extensionData = cbor.encode(extensionDataCbor).toString('base64');
    }

    return authenticatorData;
  } catch (e) {
    throw new Error('Authenticator Data could not be parsed');
  }
};

/**
 * Creates a FIDO credential and stores it
 * @param {any} attestation AuthenticatorAttestationResponse received from client
 */
export const makeCredential = async (attestation) => {
  // https://w3c.github.io/webauthn/#registering-a-new-credential

  if (!attestation.id) throw new Error('id is missing');

  if (!attestation.attestationObject) throw new Error('attestationObject is missing');

  if (!attestation.clientDataJSON) throw new Error('clientDataJSON is missing');

  // Step 1-2: Let C be the parsed the client data claimed as collected during
  // the credential creation
  let C;
  try {
    C = JSON.parse(attestation.clientDataJSON);
  } catch (e) {
    throw new Error('clientDataJSON could not be parsed');
  }

  // Step 3-6: Verify client data
  validateClientData(C, 'webauthn.create');
  // Step 7: Compute the hash of response.clientDataJSON using SHA-256.
  const clientDataHash = sha256(attestation.clientDataJSON);

  // Step 8: Perform CBOR decoding on the attestationObject
  let attestationObject;
  try {
    attestationObject = cbor.decodeFirstSync(Buffer.from(attestation.attestationObject, 'base64'));
  } catch (e) {
    throw new Error('attestationObject could not be decoded');
  }
  // Step 8.1: Parse authData data inside the attestationObject
  const authenticatorData = parseAuthenticatorData(attestationObject.authData);
  // Step 8.2: authenticatorData should contain attestedCredentialData
  if (!authenticatorData.attestedCredentialData)
    throw new Error('Did not see AD flag in authenticatorData');

  // Step 9: Verify that the RP ID hash in authData is indeed the SHA-256 hash
  // of the RP ID expected by the RP.
  if (!authenticatorData.rpIdHash === sha256(hostname)) {
    throw new Error(
      `RPID hash does not match expected value: sha256(${authenticatorData.rpIdHash})`,
    );
  }

  // Step 10: Verify that the User Present bit of the flags in authData is set
  // eslint-disable-next-line no-bitwise
  if ((authenticatorData.flags & 0b00000001) === 0) {
    throw new Error('User Present bit was not set.');
  }

  // Step 11: Verify that the User Verified bit of the flags in authData is set
  // eslint-disable-next-line no-bitwise
  if ((authenticatorData.flags & 0b00000100) === 0) {
    throw new Error('User Verified bit was not set.');
  }

  // Steps 12-19 are skipped because this is a sample app.

  // Store the credential
  // const credential = await storage.Credentials.create({
  //     id: authenticatorData.attestedCredentialData.credentialId.toString('base64'),
  //     publicKeyJwk: authenticatorData.attestedCredentialData.publicKeyJwk,
  //     signCount: authenticatorData.signCount
  // });
  const credentialIdObj = authenticatorData.attestedCredentialData.credentialId;
  const credential = {
    id: Base64.encode(credentialIdObj),
    publicKeyJwk: authenticatorData.attestedCredentialData.publicKeyJwk,
    signCount: authenticatorData.signCount,
  };
  credentialObj = credential;

  console.log(/credentialObj/, JSON.stringify(credentialObj));
  return credential;
};
