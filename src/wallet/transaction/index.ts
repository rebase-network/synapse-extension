import RPC from '@nervosnetwork/ckb-sdk-rpc';
import { assertToBeHexString } from '@nervosnetwork/ckb-sdk-utils/lib/validators';
import { ArgumentRequired } from '@nervosnetwork/ckb-sdk-utils/lib/exceptions';
import * as utils from '@nervosnetwork/ckb-sdk-utils';

import generateRawTransaction, { Cell, RawTransactionParamsBase } from './generateRawTransaction';

type Key = string;
type Address = string;
type LockHash = string;
type PublicKeyHash = string;
type Capacity = bigint | string;
type URL = string;
type BlockNumber = bigint | string;

interface RawTransactionParams extends RawTransactionParamsBase {
  fromAddress: Address;
  toAddress: Address;
  capacity: Capacity;
  cells?: Cell[];
}

interface ComplexRawTransactoinParams extends RawTransactionParamsBase {
  fromAddresses: Address[];
  receivePairs: { address: Address; capacity: Capacity }[];
  cells: Map<LockHash, CachedCell[]>;
}

const hrpSize = 6;

const cells: Map<LockHash, CachedCell[]> = new Map();

export const extractPayloadFromAddress = (address: string) => {
  const addressPayload = utils.parseAddress(address, 'hex');
  return `0x${addressPayload.slice(hrpSize)}`;
};

export const generateRawTransactionWrapper = ({
  fee,
  safeMode = true,
  deps,
  capacityThreshold,
  changeThreshold,
  ...params
}: RawTransactionParams | ComplexRawTransactoinParams) => {
  if ('fromAddress' in params && 'toAddress' in params) {
    let availableCells = params.cells || [];
    const [fromPublicKeyHash, toPublicKeyHash] = [params.fromAddress, params.toAddress].map(
      this.extractPayloadFromAddress,
    );
    if (!availableCells.length && deps) {
      const lockHash = utils.scriptToHash({
        codeHash: deps.codeHash,
        hashType: deps.hashType,
        args: toPublicKeyHash,
      });
      const cachedCells = cells.get(lockHash);
      if (cachedCells && cachedCells.length) {
        availableCells = cachedCells;
      }
    }
    return generateRawTransaction({
      fromPublicKeyHash,
      toPublicKeyHash,
      capacity: params.capacity,
      fee,
      safeMode,
      cells: availableCells,
      deps,
      capacityThreshold,
      changeThreshold,
    });
  }

  if ('fromAddresses' in params && 'receivePairs' in params) {
    const fromPublicKeyHashes: string[] = params.fromAddresses.map(this.extractPayloadFromAddress);
    const receivePairs = params.receivePairs.map((pair) => ({
      publicKeyHash: this.extractPayloadFromAddress(pair.address),
      capacity: pair.capacity,
    }));
    return generateRawTransaction({
      fromPublicKeyHashes,
      receivePairs,
      cells: params.cells || cells,
      fee,
      safeMode,
      deps,
      capacityThreshold,
      changeThreshold,
    });
  }
  throw new Error('Parameters of generateRawTransaction are invalid');
};
