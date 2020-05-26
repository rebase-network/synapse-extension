
import RPC from '@nervosnetwork/ckb-sdk-rpc'
import { assertToBeHexString } from '@nervosnetwork/ckb-sdk-utils/lib/validators'
import { ArgumentRequired } from '@nervosnetwork/ckb-sdk-utils/lib/exceptions'
import * as utils from '@nervosnetwork/ckb-sdk-utils'

import generateRawTransaction, { Cell, RawTransactionParamsBase } from './generateRawTransaction'

type Key = string
type Address = string
type LockHash = string
type PublicKeyHash = string
type Capacity = bigint | string
type URL = string
type BlockNumber = bigint | string

interface RawTransactionParams extends RawTransactionParamsBase {
  fromAddress: Address
  toAddress: Address
  capacity: Capacity
  cells?: Cell[]
}

interface ComplexRawTransactoinParams extends RawTransactionParamsBase {
  fromAddresses: Address[]
  receivePairs: { address: Address; capacity: Capacity }[]
  cells: Map<LockHash, CachedCell[]>
}

const hrpSize = 6

class CKB {
  public cells: Map<LockHash, CachedCell[]> = new Map()

  public rpc: RPC

  public utils = utils

  private _node: CKBComponents.Node

  public config: {
    secp256k1Dep?: DepCellInfo
    daoDep?: DepCellInfo
  } = {}

  constructor (nodeUrl: URL = 'http://localhost:8114') {
    this._node = {
      url: nodeUrl,
    }
    this.rpc = new RPC(nodeUrl)

    const computeTransactionHashMethod = {
      name: 'computeTransactionHash',
      method: '_compute_transaction_hash',
      paramsFormatters: [this.rpc.paramsFormatter.toRawTransaction],
    }

    /**
     * @method computeTransactionHash
     * @description this RPC is used to calculate the hash of a raw transaction
     * @deprecated this RPC method has been marked as deprecated in Nervos CKB Project
     */
    this.rpc.addMethod(computeTransactionHashMethod)

    const computeScriptHashMethod = {
      name: 'computeScriptHash',
      method: '_compute_script_hash',
      paramsFormatters: [this.rpc.paramsFormatter.toScript],
    }

    /**
     * @method computeScriptHash
     * @description this RPC is used to calculate the hash of lock/type script
     * @deprecated this RPC method has been marked as deprecated in Nervos CKB Project
     */
    this.rpc.addMethod(computeScriptHashMethod)
  }

  public setNode (node: URL | CKBComponents.Node): CKBComponents.Node {
    if (typeof node === 'string') {
      this._node.url = node
    } else {
      this._node = node
    }

    this.rpc.setNode(this._node)

    return this._node
  }

  public get node (): CKBComponents.Node {
    return this._node
  }

  private extractPayloadFromAddress = (address: string) => {
    const addressPayload = this.utils.parseAddress(address, 'hex')
    return `0x${addressPayload.slice(hrpSize)}`
  }

  public generateRawTransaction = ({
    fee,
    safeMode = true,
    deps,
    capacityThreshold,
    changeThreshold,
    ...params
  }: RawTransactionParams | ComplexRawTransactoinParams) => {
    if ('fromAddress' in params && 'toAddress' in params) {
      let availableCells = params.cells || []
      const [fromPublicKeyHash, toPublicKeyHash] =
        [params.fromAddress, params.toAddress].map(this.extractPayloadFromAddress)
      if (!availableCells.length && deps) {
        const lockHash = this.utils.scriptToHash({
          codeHash: deps.codeHash,
          hashType: deps.hashType,
          args: toPublicKeyHash,
        })
        const cachedCells = this.cells.get(lockHash)
        if (cachedCells && cachedCells.length) {
          availableCells = cachedCells
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
      })
    }

    if ('fromAddresses' in params && 'receivePairs' in params) {
      const fromPublicKeyHashes = params.fromAddresses.map(this.extractPayloadFromAddress)
      const receivePairs = params.receivePairs.map(pair => ({
        publicKeyHash: this.extractPayloadFromAddress(pair.address),
        capacity: pair.capacity,
      }))
      return generateRawTransaction({
        fromPublicKeyHashes,
        receivePairs,
        cells: params.cells || this.cells,
        fee,
        safeMode,
        deps,
        capacityThreshold,
        changeThreshold,
      })
    }
    throw new Error('Parameters of generateRawTransaction are invalid')
  }
}

export default CKB
