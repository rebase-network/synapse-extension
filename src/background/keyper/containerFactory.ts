import { Container } from '@keyper/container';
import { SignatureAlgorithm } from '@keyper/specs';
import signProvider from './signProviders/secp256k1';

const containerFactory = {
  createContainer: () => {
    return new Container([
      {
        algorithm: SignatureAlgorithm.secp256k1,
        provider: signProvider,
      },
    ]);
  },
};

export default containerFactory;
