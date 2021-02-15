import { NETWORK_TYPES } from '@common/utils/constants/networks';
import locksInfo from './constants/locksInfo';

const { testnet, mainnet } = NETWORK_TYPES;

const isAnypay = (codeHash: string) => {
  return (
    [locksInfo[testnet].anypay.codeHash, locksInfo[mainnet].anypay.codeHash].indexOf(codeHash) !==
    -1
  );
};

export default {
  isAnypay,
};
