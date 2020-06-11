declare namespace RPCMessage {
  /* Auth */
  export interface AuthResponse {
    type: string;
    success: boolean;
    message: string;
    token: string;
  }

  export interface AuthRequest {
    type: string;
    origin: string;
  }

  /* Locks */
  export interface LocksRequest {
    type: string;
    token: string;
    requestId: string;
  }

  export interface LocksResponse {
    type: string;
    requestId: string;
    success: boolean;
    message: string;
    data: LocksResponsePayload;
  }

  export interface LocksResponsePayload {
    locks: LockScript[];
  }

  export interface LockScript {
    code_hash: string;
    hash_type: string;
    args: string;
  }

  /* Sign */
  export interface KeyperConfig {
    index: number;
    length: number;
  }

  export interface SignResponsePayload {
    tx: CKBComponents.RawTransaction;
  }

  export interface SignRequest {
    type: string;
    token: string;
    requestId: string;
    data: SignRequestPayload;
  }

  export interface SignRequestPayload {
    target: string;
    tx: CKBComponents.RawTransaction;
    config: KeyperConfig;
    meta: string;
  }

  export interface SignResponse {
    type: string;
    requestId: string;
    success: boolean;
    message: string;
    data: SignResponsePayload;
  }

  /* Sign and send */
  export interface SignSendResponsePayload {
    hash: string;
  }

  export interface SignSendResponse {
    type: string;
    requestId: string;
    success: boolean;
    message: string;
    data: SignSendResponsePayload;
  }
}
