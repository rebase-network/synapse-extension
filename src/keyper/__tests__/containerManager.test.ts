import { Container } from '@keyper/container';
import { SignatureAlgorithm } from '@keyper/specs';
import ContainerManager from '../containerManager';

describe('keyper container manager', () => {
  it('should able to add a container', () => {
    const container = new Container([
      {
        algorithm: SignatureAlgorithm.secp256k1,
        provider: {
          async sign(context, message) {
            console.log('sign method: ', context, message);
          },
        },
      },
    ]);
    const manager = ContainerManager.getInstance();
    manager.addContainer({ name: 'testnet', container });
    const result = manager.getContainer('testnet');
    expect(result).toEqual(container);
  });
});
