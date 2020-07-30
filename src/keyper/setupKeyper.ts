import { Container } from '@keyper/container';
import { SignatureAlgorithm } from '@keyper/specs';
import ContainerManager from './containerManager';
import { Keccak256LockScript, AnypayLockScript, Secp256k1LockScript } from './locks';

const networks = ['testnet', 'mainnet'];

const containerFactory = () => {
  const container = new Container([
    {
      algorithm: SignatureAlgorithm.secp256k1,
      provider: {
        async sign(context, message) {
          return 'sign';
        },
      },
    },
  ]);
  return container;
};

export default () => {
  const manager = ContainerManager.getInstance();
  networks.forEach((network) => {
    manager.addContainer({
      network,
      container: containerFactory(),
    });
  });
  const containers = manager.getAllContainers();
  Object.keys(containers).forEach((network) => {
    const container = containers[network];
    // add lock script
    container.addLockScript(new Secp256k1LockScript('1', '2'));
    container.addLockScript(new Keccak256LockScript('1', '2'));
    container.addLockScript(new AnypayLockScript('1', '2'));
  });
};
