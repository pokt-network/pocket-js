/* eslint-disable */
import * as Long from 'long'
import * as _m0 from 'protobufjs/minimal'
import { Any } from './google/protobuf/any'

export const protobufPackage = 'pocketjs'

export interface ProtoStdTx {
  msg: Any | undefined
  fee: Coin[]
  signature: ProtoStdSignature | undefined
  memo: string
  entropy: number
}

export interface ProtoStdSignature {
  publicKey: Uint8Array
  Signature: Uint8Array
}

export interface StdSignDoc {
  ChainID: string
  fee: Uint8Array
  memo: string
  msg: Uint8Array
  entropy: number
}

export interface Coin {
  denom: string
  amount: string
}

/**
 * DecCoin defines a token with a denomination and a decimal amount.
 *
 * NOTE: The amount field is an Dec which implements the custom method
 * signatures required by gogoproto.
 */
export interface DecCoin {
  denom: string
  amount: string
}

export interface MsgProtoStake {
  pubKey: Uint8Array
  chains: string[]
  value: string
}

export interface MsgBeginUnstake {
  Address: Uint8Array
}

export interface MsgUnjail {
  AppAddr: Uint8Array
}

export interface MsgProtoNodeStake8 {
  Publickey: Uint8Array
  Chains: string[]
  value: string
  ServiceUrl: string
  OutAddress: Uint8Array
}

export interface MsgBeginNodeUnstake8 {
  Address: Uint8Array
  Signer: Uint8Array
}

export interface MsgNodeUnjail {
  ValidatorAddr: Uint8Array
}

export interface MsgNodeUnjail8 {
  ValidatorAddr: Uint8Array
  Signer: Uint8Array
}

export interface MsgSend {
  FromAddress: Uint8Array
  ToAddress: Uint8Array
  amount: string
}

export interface MsgDAOTransfer {
  FromAddress: Uint8Array
  ToAddress: Uint8Array
  amount: string
  action: string
}

export interface Upgrade {
  height: number
  version: string
  oldUpgradeHeight: number
  features: string[]
}

export interface MsgUpgrade {
  address: Uint8Array
  upgrade: Upgrade | undefined
}

export interface MsgChangeParam {
  FromAddress: Uint8Array
  paramKey: string
  paramVal: Uint8Array
}

function createBaseProtoStdTx(): ProtoStdTx {
  return { msg: undefined, fee: [], signature: undefined, memo: '', entropy: 0 }
}

export const ProtoStdTx = {
  encode(
    message: ProtoStdTx,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
    if (message.msg !== undefined) {
      Any.encode(message.msg, writer.uint32(10).fork()).ldelim()
    }
    for (const v of message.fee) {
      Coin.encode(v!, writer.uint32(18).fork()).ldelim()
    }
    if (message.signature !== undefined) {
      ProtoStdSignature.encode(
        message.signature,
        writer.uint32(26).fork()
      ).ldelim()
    }
    if (message.memo !== '') {
      writer.uint32(34).string(message.memo)
    }
    if (message.entropy !== 0) {
      writer.uint32(40).int64(message.entropy)
    }
    return writer
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): ProtoStdTx {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input)
    let end = length === undefined ? reader.len : reader.pos + length
    const message = createBaseProtoStdTx()
    while (reader.pos < end) {
      const tag = reader.uint32()
      switch (tag >>> 3) {
        case 1:
          message.msg = Any.decode(reader, reader.uint32())
          break
        case 2:
          message.fee.push(Coin.decode(reader, reader.uint32()))
          break
        case 3:
          message.signature = ProtoStdSignature.decode(reader, reader.uint32())
          break
        case 4:
          message.memo = reader.string()
          break
        case 5:
          message.entropy = longToNumber(reader.int64() as Long)
          break
        default:
          reader.skipType(tag & 7)
          break
      }
    }
    return message
  },

  fromJSON(object: any): ProtoStdTx {
    return {
      msg: isSet(object.msg) ? Any.fromJSON(object.msg) : undefined,
      fee: Array.isArray(object?.fee)
        ? object.fee.map((e: any) => Coin.fromJSON(e))
        : [],
      signature: isSet(object.signature)
        ? ProtoStdSignature.fromJSON(object.signature)
        : undefined,
      memo: isSet(object.memo) ? String(object.memo) : '',
      entropy: isSet(object.entropy) ? Number(object.entropy) : 0,
    }
  },

  toJSON(message: ProtoStdTx): unknown {
    const obj: any = {}
    message.msg !== undefined &&
      (obj.msg = message.msg ? Any.toJSON(message.msg) : undefined)
    if (message.fee) {
      obj.fee = message.fee.map((e) => (e ? Coin.toJSON(e) : undefined))
    } else {
      obj.fee = []
    }
    message.signature !== undefined &&
      (obj.signature = message.signature
        ? ProtoStdSignature.toJSON(message.signature)
        : undefined)
    message.memo !== undefined && (obj.memo = message.memo)
    message.entropy !== undefined && (obj.entropy = Math.round(message.entropy))
    return obj
  },

  fromPartial<I extends Exact<DeepPartial<ProtoStdTx>, I>>(
    object: I
  ): ProtoStdTx {
    const message = createBaseProtoStdTx()
    message.msg =
      object.msg !== undefined && object.msg !== null
        ? Any.fromPartial(object.msg)
        : undefined
    message.fee = object.fee?.map((e) => Coin.fromPartial(e)) || []
    message.signature =
      object.signature !== undefined && object.signature !== null
        ? ProtoStdSignature.fromPartial(object.signature)
        : undefined
    message.memo = object.memo ?? ''
    message.entropy = object.entropy ?? 0
    return message
  },
}

function createBaseProtoStdSignature(): ProtoStdSignature {
  return { publicKey: new Uint8Array(), Signature: new Uint8Array() }
}

export const ProtoStdSignature = {
  encode(
    message: ProtoStdSignature,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
    if (message.publicKey.length !== 0) {
      writer.uint32(10).bytes(message.publicKey)
    }
    if (message.Signature.length !== 0) {
      writer.uint32(18).bytes(message.Signature)
    }
    return writer
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): ProtoStdSignature {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input)
    let end = length === undefined ? reader.len : reader.pos + length
    const message = createBaseProtoStdSignature()
    while (reader.pos < end) {
      const tag = reader.uint32()
      switch (tag >>> 3) {
        case 1:
          message.publicKey = reader.bytes()
          break
        case 2:
          message.Signature = reader.bytes()
          break
        default:
          reader.skipType(tag & 7)
          break
      }
    }
    return message
  },

  fromJSON(object: any): ProtoStdSignature {
    return {
      publicKey: isSet(object.publicKey)
        ? bytesFromBase64(object.publicKey)
        : new Uint8Array(),
      Signature: isSet(object.Signature)
        ? bytesFromBase64(object.Signature)
        : new Uint8Array(),
    }
  },

  toJSON(message: ProtoStdSignature): unknown {
    const obj: any = {}
    message.publicKey !== undefined &&
      (obj.publicKey = base64FromBytes(
        message.publicKey !== undefined ? message.publicKey : new Uint8Array()
      ))
    message.Signature !== undefined &&
      (obj.Signature = base64FromBytes(
        message.Signature !== undefined ? message.Signature : new Uint8Array()
      ))
    return obj
  },

  fromPartial<I extends Exact<DeepPartial<ProtoStdSignature>, I>>(
    object: I
  ): ProtoStdSignature {
    const message = createBaseProtoStdSignature()
    message.publicKey = object.publicKey ?? new Uint8Array()
    message.Signature = object.Signature ?? new Uint8Array()
    return message
  },
}

function createBaseStdSignDoc(): StdSignDoc {
  return {
    ChainID: '',
    fee: new Uint8Array(),
    memo: '',
    msg: new Uint8Array(),
    entropy: 0,
  }
}

export const StdSignDoc = {
  encode(
    message: StdSignDoc,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
    if (message.ChainID !== '') {
      writer.uint32(10).string(message.ChainID)
    }
    if (message.fee.length !== 0) {
      writer.uint32(18).bytes(message.fee)
    }
    if (message.memo !== '') {
      writer.uint32(26).string(message.memo)
    }
    if (message.msg.length !== 0) {
      writer.uint32(34).bytes(message.msg)
    }
    if (message.entropy !== 0) {
      writer.uint32(40).int64(message.entropy)
    }
    return writer
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): StdSignDoc {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input)
    let end = length === undefined ? reader.len : reader.pos + length
    const message = createBaseStdSignDoc()
    while (reader.pos < end) {
      const tag = reader.uint32()
      switch (tag >>> 3) {
        case 1:
          message.ChainID = reader.string()
          break
        case 2:
          message.fee = reader.bytes()
          break
        case 3:
          message.memo = reader.string()
          break
        case 4:
          message.msg = reader.bytes()
          break
        case 5:
          message.entropy = longToNumber(reader.int64() as Long)
          break
        default:
          reader.skipType(tag & 7)
          break
      }
    }
    return message
  },

  fromJSON(object: any): StdSignDoc {
    return {
      ChainID: isSet(object.ChainID) ? String(object.ChainID) : '',
      fee: isSet(object.fee) ? bytesFromBase64(object.fee) : new Uint8Array(),
      memo: isSet(object.memo) ? String(object.memo) : '',
      msg: isSet(object.msg) ? bytesFromBase64(object.msg) : new Uint8Array(),
      entropy: isSet(object.entropy) ? Number(object.entropy) : 0,
    }
  },

  toJSON(message: StdSignDoc): unknown {
    const obj: any = {}
    message.ChainID !== undefined && (obj.ChainID = message.ChainID)
    message.fee !== undefined &&
      (obj.fee = base64FromBytes(
        message.fee !== undefined ? message.fee : new Uint8Array()
      ))
    message.memo !== undefined && (obj.memo = message.memo)
    message.msg !== undefined &&
      (obj.msg = base64FromBytes(
        message.msg !== undefined ? message.msg : new Uint8Array()
      ))
    message.entropy !== undefined && (obj.entropy = Math.round(message.entropy))
    return obj
  },

  fromPartial<I extends Exact<DeepPartial<StdSignDoc>, I>>(
    object: I
  ): StdSignDoc {
    const message = createBaseStdSignDoc()
    message.ChainID = object.ChainID ?? ''
    message.fee = object.fee ?? new Uint8Array()
    message.memo = object.memo ?? ''
    message.msg = object.msg ?? new Uint8Array()
    message.entropy = object.entropy ?? 0
    return message
  },
}

function createBaseCoin(): Coin {
  return { denom: '', amount: '' }
}

export const Coin = {
  encode(message: Coin, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.denom !== '') {
      writer.uint32(10).string(message.denom)
    }
    if (message.amount !== '') {
      writer.uint32(18).string(message.amount)
    }
    return writer
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): Coin {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input)
    let end = length === undefined ? reader.len : reader.pos + length
    const message = createBaseCoin()
    while (reader.pos < end) {
      const tag = reader.uint32()
      switch (tag >>> 3) {
        case 1:
          message.denom = reader.string()
          break
        case 2:
          message.amount = reader.string()
          break
        default:
          reader.skipType(tag & 7)
          break
      }
    }
    return message
  },

  fromJSON(object: any): Coin {
    return {
      denom: isSet(object.denom) ? String(object.denom) : '',
      amount: isSet(object.amount) ? String(object.amount) : '',
    }
  },

  toJSON(message: Coin): unknown {
    const obj: any = {}
    message.denom !== undefined && (obj.denom = message.denom)
    message.amount !== undefined && (obj.amount = message.amount)
    return obj
  },

  fromPartial<I extends Exact<DeepPartial<Coin>, I>>(object: I): Coin {
    const message = createBaseCoin()
    message.denom = object.denom ?? ''
    message.amount = object.amount ?? ''
    return message
  },
}

function createBaseDecCoin(): DecCoin {
  return { denom: '', amount: '' }
}

export const DecCoin = {
  encode(
    message: DecCoin,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
    if (message.denom !== '') {
      writer.uint32(10).string(message.denom)
    }
    if (message.amount !== '') {
      writer.uint32(18).string(message.amount)
    }
    return writer
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): DecCoin {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input)
    let end = length === undefined ? reader.len : reader.pos + length
    const message = createBaseDecCoin()
    while (reader.pos < end) {
      const tag = reader.uint32()
      switch (tag >>> 3) {
        case 1:
          message.denom = reader.string()
          break
        case 2:
          message.amount = reader.string()
          break
        default:
          reader.skipType(tag & 7)
          break
      }
    }
    return message
  },

  fromJSON(object: any): DecCoin {
    return {
      denom: isSet(object.denom) ? String(object.denom) : '',
      amount: isSet(object.amount) ? String(object.amount) : '',
    }
  },

  toJSON(message: DecCoin): unknown {
    const obj: any = {}
    message.denom !== undefined && (obj.denom = message.denom)
    message.amount !== undefined && (obj.amount = message.amount)
    return obj
  },

  fromPartial<I extends Exact<DeepPartial<DecCoin>, I>>(object: I): DecCoin {
    const message = createBaseDecCoin()
    message.denom = object.denom ?? ''
    message.amount = object.amount ?? ''
    return message
  },
}

function createBaseMsgProtoStake(): MsgProtoStake {
  return { pubKey: new Uint8Array(), chains: [], value: '' }
}

export const MsgProtoStake = {
  encode(
    message: MsgProtoStake,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
    if (message.pubKey.length !== 0) {
      writer.uint32(10).bytes(message.pubKey)
    }
    for (const v of message.chains) {
      writer.uint32(18).string(v!)
    }
    if (message.value !== '') {
      writer.uint32(26).string(message.value)
    }
    return writer
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): MsgProtoStake {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input)
    let end = length === undefined ? reader.len : reader.pos + length
    const message = createBaseMsgProtoStake()
    while (reader.pos < end) {
      const tag = reader.uint32()
      switch (tag >>> 3) {
        case 1:
          message.pubKey = reader.bytes()
          break
        case 2:
          message.chains.push(reader.string())
          break
        case 3:
          message.value = reader.string()
          break
        default:
          reader.skipType(tag & 7)
          break
      }
    }
    return message
  },

  fromJSON(object: any): MsgProtoStake {
    return {
      pubKey: isSet(object.pubKey)
        ? bytesFromBase64(object.pubKey)
        : new Uint8Array(),
      chains: Array.isArray(object?.chains)
        ? object.chains.map((e: any) => String(e))
        : [],
      value: isSet(object.value) ? String(object.value) : '',
    }
  },

  toJSON(message: MsgProtoStake): unknown {
    const obj: any = {}
    message.pubKey !== undefined &&
      (obj.pubKey = base64FromBytes(
        message.pubKey !== undefined ? message.pubKey : new Uint8Array()
      ))
    if (message.chains) {
      obj.chains = message.chains.map((e) => e)
    } else {
      obj.chains = []
    }
    message.value !== undefined && (obj.value = message.value)
    return obj
  },

  fromPartial<I extends Exact<DeepPartial<MsgProtoStake>, I>>(
    object: I
  ): MsgProtoStake {
    const message = createBaseMsgProtoStake()
    message.pubKey = object.pubKey ?? new Uint8Array()
    message.chains = object.chains?.map((e) => e) || []
    message.value = object.value ?? ''
    return message
  },
}

function createBaseMsgBeginUnstake(): MsgBeginUnstake {
  return { Address: new Uint8Array() }
}

export const MsgBeginUnstake = {
  encode(
    message: MsgBeginUnstake,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
    if (message.Address.length !== 0) {
      writer.uint32(10).bytes(message.Address)
    }
    return writer
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): MsgBeginUnstake {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input)
    let end = length === undefined ? reader.len : reader.pos + length
    const message = createBaseMsgBeginUnstake()
    while (reader.pos < end) {
      const tag = reader.uint32()
      switch (tag >>> 3) {
        case 1:
          message.Address = reader.bytes()
          break
        default:
          reader.skipType(tag & 7)
          break
      }
    }
    return message
  },

  fromJSON(object: any): MsgBeginUnstake {
    return {
      Address: isSet(object.Address)
        ? bytesFromBase64(object.Address)
        : new Uint8Array(),
    }
  },

  toJSON(message: MsgBeginUnstake): unknown {
    const obj: any = {}
    message.Address !== undefined &&
      (obj.Address = base64FromBytes(
        message.Address !== undefined ? message.Address : new Uint8Array()
      ))
    return obj
  },

  fromPartial<I extends Exact<DeepPartial<MsgBeginUnstake>, I>>(
    object: I
  ): MsgBeginUnstake {
    const message = createBaseMsgBeginUnstake()
    message.Address = object.Address ?? new Uint8Array()
    return message
  },
}

function createBaseMsgUnjail(): MsgUnjail {
  return { AppAddr: new Uint8Array() }
}

export const MsgUnjail = {
  encode(
    message: MsgUnjail,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
    if (message.AppAddr.length !== 0) {
      writer.uint32(10).bytes(message.AppAddr)
    }
    return writer
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): MsgUnjail {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input)
    let end = length === undefined ? reader.len : reader.pos + length
    const message = createBaseMsgUnjail()
    while (reader.pos < end) {
      const tag = reader.uint32()
      switch (tag >>> 3) {
        case 1:
          message.AppAddr = reader.bytes()
          break
        default:
          reader.skipType(tag & 7)
          break
      }
    }
    return message
  },

  fromJSON(object: any): MsgUnjail {
    return {
      AppAddr: isSet(object.AppAddr)
        ? bytesFromBase64(object.AppAddr)
        : new Uint8Array(),
    }
  },

  toJSON(message: MsgUnjail): unknown {
    const obj: any = {}
    message.AppAddr !== undefined &&
      (obj.AppAddr = base64FromBytes(
        message.AppAddr !== undefined ? message.AppAddr : new Uint8Array()
      ))
    return obj
  },

  fromPartial<I extends Exact<DeepPartial<MsgUnjail>, I>>(
    object: I
  ): MsgUnjail {
    const message = createBaseMsgUnjail()
    message.AppAddr = object.AppAddr ?? new Uint8Array()
    return message
  },
}

function createBaseMsgProtoNodeStake8(): MsgProtoNodeStake8 {
  return {
    Publickey: new Uint8Array(),
    Chains: [],
    value: '',
    ServiceUrl: '',
    OutAddress: new Uint8Array(),
  }
}

export const MsgProtoNodeStake8 = {
  encode(
    message: MsgProtoNodeStake8,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
    if (message.Publickey.length !== 0) {
      writer.uint32(10).bytes(message.Publickey)
    }
    for (const v of message.Chains) {
      writer.uint32(18).string(v!)
    }
    if (message.value !== '') {
      writer.uint32(26).string(message.value)
    }
    if (message.ServiceUrl !== '') {
      writer.uint32(34).string(message.ServiceUrl)
    }
    if (message.OutAddress.length !== 0) {
      writer.uint32(42).bytes(message.OutAddress)
    }
    return writer
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): MsgProtoNodeStake8 {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input)
    let end = length === undefined ? reader.len : reader.pos + length
    const message = createBaseMsgProtoNodeStake8()
    while (reader.pos < end) {
      const tag = reader.uint32()
      switch (tag >>> 3) {
        case 1:
          message.Publickey = reader.bytes()
          break
        case 2:
          message.Chains.push(reader.string())
          break
        case 3:
          message.value = reader.string()
          break
        case 4:
          message.ServiceUrl = reader.string()
          break
        case 5:
          message.OutAddress = reader.bytes()
          break
        default:
          reader.skipType(tag & 7)
          break
      }
    }
    return message
  },

  fromJSON(object: any): MsgProtoNodeStake8 {
    return {
      Publickey: isSet(object.Publickey)
        ? bytesFromBase64(object.Publickey)
        : new Uint8Array(),
      Chains: Array.isArray(object?.Chains)
        ? object.Chains.map((e: any) => String(e))
        : [],
      value: isSet(object.value) ? String(object.value) : '',
      ServiceUrl: isSet(object.ServiceUrl) ? String(object.ServiceUrl) : '',
      OutAddress: isSet(object.OutAddress)
        ? bytesFromBase64(object.OutAddress)
        : new Uint8Array(),
    }
  },

  toJSON(message: MsgProtoNodeStake8): unknown {
    const obj: any = {}
    message.Publickey !== undefined &&
      (obj.Publickey = base64FromBytes(
        message.Publickey !== undefined ? message.Publickey : new Uint8Array()
      ))
    if (message.Chains) {
      obj.Chains = message.Chains.map((e) => e)
    } else {
      obj.Chains = []
    }
    message.value !== undefined && (obj.value = message.value)
    message.ServiceUrl !== undefined && (obj.ServiceUrl = message.ServiceUrl)
    message.OutAddress !== undefined &&
      (obj.OutAddress = base64FromBytes(
        message.OutAddress !== undefined ? message.OutAddress : new Uint8Array()
      ))
    return obj
  },

  fromPartial<I extends Exact<DeepPartial<MsgProtoNodeStake8>, I>>(
    object: I
  ): MsgProtoNodeStake8 {
    const message = createBaseMsgProtoNodeStake8()
    message.Publickey = object.Publickey ?? new Uint8Array()
    message.Chains = object.Chains?.map((e) => e) || []
    message.value = object.value ?? ''
    message.ServiceUrl = object.ServiceUrl ?? ''
    message.OutAddress = object.OutAddress ?? new Uint8Array()
    return message
  },
}

function createBaseMsgBeginNodeUnstake8(): MsgBeginNodeUnstake8 {
  return { Address: new Uint8Array(), Signer: new Uint8Array() }
}

export const MsgBeginNodeUnstake8 = {
  encode(
    message: MsgBeginNodeUnstake8,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
    if (message.Address.length !== 0) {
      writer.uint32(10).bytes(message.Address)
    }
    if (message.Signer.length !== 0) {
      writer.uint32(18).bytes(message.Signer)
    }
    return writer
  },

  decode(
    input: _m0.Reader | Uint8Array,
    length?: number
  ): MsgBeginNodeUnstake8 {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input)
    let end = length === undefined ? reader.len : reader.pos + length
    const message = createBaseMsgBeginNodeUnstake8()
    while (reader.pos < end) {
      const tag = reader.uint32()
      switch (tag >>> 3) {
        case 1:
          message.Address = reader.bytes()
          break
        case 2:
          message.Signer = reader.bytes()
          break
        default:
          reader.skipType(tag & 7)
          break
      }
    }
    return message
  },

  fromJSON(object: any): MsgBeginNodeUnstake8 {
    return {
      Address: isSet(object.Address)
        ? bytesFromBase64(object.Address)
        : new Uint8Array(),
      Signer: isSet(object.Signer)
        ? bytesFromBase64(object.Signer)
        : new Uint8Array(),
    }
  },

  toJSON(message: MsgBeginNodeUnstake8): unknown {
    const obj: any = {}
    message.Address !== undefined &&
      (obj.Address = base64FromBytes(
        message.Address !== undefined ? message.Address : new Uint8Array()
      ))
    message.Signer !== undefined &&
      (obj.Signer = base64FromBytes(
        message.Signer !== undefined ? message.Signer : new Uint8Array()
      ))
    return obj
  },

  fromPartial<I extends Exact<DeepPartial<MsgBeginNodeUnstake8>, I>>(
    object: I
  ): MsgBeginNodeUnstake8 {
    const message = createBaseMsgBeginNodeUnstake8()
    message.Address = object.Address ?? new Uint8Array()
    message.Signer = object.Signer ?? new Uint8Array()
    return message
  },
}

function createBaseMsgNodeUnjail(): MsgNodeUnjail {
  return { ValidatorAddr: new Uint8Array() }
}

export const MsgNodeUnjail = {
  encode(
    message: MsgNodeUnjail,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
    if (message.ValidatorAddr.length !== 0) {
      writer.uint32(10).bytes(message.ValidatorAddr)
    }
    return writer
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): MsgNodeUnjail {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input)
    let end = length === undefined ? reader.len : reader.pos + length
    const message = createBaseMsgNodeUnjail()
    while (reader.pos < end) {
      const tag = reader.uint32()
      switch (tag >>> 3) {
        case 1:
          message.ValidatorAddr = reader.bytes()
          break
        default:
          reader.skipType(tag & 7)
          break
      }
    }
    return message
  },

  fromJSON(object: any): MsgNodeUnjail {
    return {
      ValidatorAddr: isSet(object.ValidatorAddr)
        ? bytesFromBase64(object.ValidatorAddr)
        : new Uint8Array(),
    }
  },

  toJSON(message: MsgNodeUnjail): unknown {
    const obj: any = {}
    message.ValidatorAddr !== undefined &&
      (obj.ValidatorAddr = base64FromBytes(
        message.ValidatorAddr !== undefined
          ? message.ValidatorAddr
          : new Uint8Array()
      ))
    return obj
  },

  fromPartial<I extends Exact<DeepPartial<MsgNodeUnjail>, I>>(
    object: I
  ): MsgNodeUnjail {
    const message = createBaseMsgNodeUnjail()
    message.ValidatorAddr = object.ValidatorAddr ?? new Uint8Array()
    return message
  },
}

function createBaseMsgNodeUnjail8(): MsgNodeUnjail8 {
  return { ValidatorAddr: new Uint8Array(), Signer: new Uint8Array() }
}

export const MsgNodeUnjail8 = {
  encode(
    message: MsgNodeUnjail8,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
    if (message.ValidatorAddr.length !== 0) {
      writer.uint32(10).bytes(message.ValidatorAddr)
    }
    if (message.Signer.length !== 0) {
      writer.uint32(18).bytes(message.Signer)
    }
    return writer
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): MsgNodeUnjail8 {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input)
    let end = length === undefined ? reader.len : reader.pos + length
    const message = createBaseMsgNodeUnjail8()
    while (reader.pos < end) {
      const tag = reader.uint32()
      switch (tag >>> 3) {
        case 1:
          message.ValidatorAddr = reader.bytes()
          break
        case 2:
          message.Signer = reader.bytes()
          break
        default:
          reader.skipType(tag & 7)
          break
      }
    }
    return message
  },

  fromJSON(object: any): MsgNodeUnjail8 {
    return {
      ValidatorAddr: isSet(object.ValidatorAddr)
        ? bytesFromBase64(object.ValidatorAddr)
        : new Uint8Array(),
      Signer: isSet(object.Signer)
        ? bytesFromBase64(object.Signer)
        : new Uint8Array(),
    }
  },

  toJSON(message: MsgNodeUnjail8): unknown {
    const obj: any = {}
    message.ValidatorAddr !== undefined &&
      (obj.ValidatorAddr = base64FromBytes(
        message.ValidatorAddr !== undefined
          ? message.ValidatorAddr
          : new Uint8Array()
      ))
    message.Signer !== undefined &&
      (obj.Signer = base64FromBytes(
        message.Signer !== undefined ? message.Signer : new Uint8Array()
      ))
    return obj
  },

  fromPartial<I extends Exact<DeepPartial<MsgNodeUnjail8>, I>>(
    object: I
  ): MsgNodeUnjail8 {
    const message = createBaseMsgNodeUnjail8()
    message.ValidatorAddr = object.ValidatorAddr ?? new Uint8Array()
    message.Signer = object.Signer ?? new Uint8Array()
    return message
  },
}

function createBaseMsgSend(): MsgSend {
  return {
    FromAddress: new Uint8Array(),
    ToAddress: new Uint8Array(),
    amount: '',
  }
}

export const MsgSend = {
  encode(
    message: MsgSend,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
    if (message.FromAddress.length !== 0) {
      writer.uint32(10).bytes(message.FromAddress)
    }
    if (message.ToAddress.length !== 0) {
      writer.uint32(18).bytes(message.ToAddress)
    }
    if (message.amount !== '') {
      writer.uint32(26).string(message.amount)
    }
    return writer
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): MsgSend {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input)
    let end = length === undefined ? reader.len : reader.pos + length
    const message = createBaseMsgSend()
    while (reader.pos < end) {
      const tag = reader.uint32()
      switch (tag >>> 3) {
        case 1:
          message.FromAddress = reader.bytes()
          break
        case 2:
          message.ToAddress = reader.bytes()
          break
        case 3:
          message.amount = reader.string()
          break
        default:
          reader.skipType(tag & 7)
          break
      }
    }
    return message
  },

  fromJSON(object: any): MsgSend {
    return {
      FromAddress: isSet(object.FromAddress)
        ? bytesFromBase64(object.FromAddress)
        : new Uint8Array(),
      ToAddress: isSet(object.ToAddress)
        ? bytesFromBase64(object.ToAddress)
        : new Uint8Array(),
      amount: isSet(object.amount) ? String(object.amount) : '',
    }
  },

  toJSON(message: MsgSend): unknown {
    const obj: any = {}
    message.FromAddress !== undefined &&
      (obj.FromAddress = base64FromBytes(
        message.FromAddress !== undefined
          ? message.FromAddress
          : new Uint8Array()
      ))
    message.ToAddress !== undefined &&
      (obj.ToAddress = base64FromBytes(
        message.ToAddress !== undefined ? message.ToAddress : new Uint8Array()
      ))
    message.amount !== undefined && (obj.amount = message.amount)
    return obj
  },

  fromPartial<I extends Exact<DeepPartial<MsgSend>, I>>(object: I): MsgSend {
    const message = createBaseMsgSend()
    message.FromAddress = object.FromAddress ?? new Uint8Array()
    message.ToAddress = object.ToAddress ?? new Uint8Array()
    message.amount = object.amount ?? ''
    return message
  },
}

function createBaseMsgDAOTransfer(): MsgDAOTransfer {
  return {
    FromAddress: new Uint8Array(),
    ToAddress: new Uint8Array(),
    amount: '',
    action: '',
  }
}

export const MsgDAOTransfer = {
  encode(
    message: MsgDAOTransfer,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
    if (message.FromAddress.length !== 0) {
      writer.uint32(10).bytes(message.FromAddress)
    }
    if (message.ToAddress.length !== 0) {
      writer.uint32(18).bytes(message.ToAddress)
    }
    if (message.amount !== '') {
      writer.uint32(26).string(message.amount)
    }
    if (message.action !== '') {
      writer.uint32(34).string(message.action)
    }
    return writer
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): MsgDAOTransfer {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input)
    let end = length === undefined ? reader.len : reader.pos + length
    const message = createBaseMsgDAOTransfer()
    while (reader.pos < end) {
      const tag = reader.uint32()
      switch (tag >>> 3) {
        case 1:
          message.FromAddress = reader.bytes()
          break
        case 2:
          message.ToAddress = reader.bytes()
          break
        case 3:
          message.amount = reader.string()
          break
        case 4:
          message.action = reader.string()
          break
        default:
          reader.skipType(tag & 7)
          break
      }
    }
    return message
  },

  fromJSON(object: any): MsgDAOTransfer {
    return {
      FromAddress: isSet(object.FromAddress)
        ? bytesFromBase64(object.FromAddress)
        : new Uint8Array(),
      ToAddress: isSet(object.ToAddress)
        ? bytesFromBase64(object.ToAddress)
        : new Uint8Array(),
      amount: isSet(object.amount) ? String(object.amount) : '',
      action: isSet(object.action) ? String(object.action) : '',
    }
  },

  toJSON(message: MsgDAOTransfer): unknown {
    const obj: any = {}
    message.FromAddress !== undefined &&
      (obj.FromAddress = base64FromBytes(
        message.FromAddress !== undefined
          ? message.FromAddress
          : new Uint8Array()
      ))
    message.ToAddress !== undefined &&
      (obj.ToAddress = base64FromBytes(
        message.ToAddress !== undefined ? message.ToAddress : new Uint8Array()
      ))
    message.amount !== undefined && (obj.amount = message.amount)
    message.action !== undefined && (obj.action = message.action)
    return obj
  },

  fromPartial<I extends Exact<DeepPartial<MsgDAOTransfer>, I>>(
    object: I
  ): MsgDAOTransfer {
    const message = createBaseMsgDAOTransfer()
    message.FromAddress = object.FromAddress ?? new Uint8Array()
    message.ToAddress = object.ToAddress ?? new Uint8Array()
    message.amount = object.amount ?? ''
    message.action = object.action ?? ''
    return message
  },
}

function createBaseUpgrade(): Upgrade {
  return { height: 0, version: '', oldUpgradeHeight: 0, features: [] }
}

export const Upgrade = {
  encode(
    message: Upgrade,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
    if (message.height !== 0) {
      writer.uint32(8).int64(message.height)
    }
    if (message.version !== '') {
      writer.uint32(18).string(message.version)
    }
    if (message.oldUpgradeHeight !== 0) {
      writer.uint32(24).int64(message.oldUpgradeHeight)
    }
    for (const v of message.features) {
      writer.uint32(34).string(v!)
    }
    return writer
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): Upgrade {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input)
    let end = length === undefined ? reader.len : reader.pos + length
    const message = createBaseUpgrade()
    while (reader.pos < end) {
      const tag = reader.uint32()
      switch (tag >>> 3) {
        case 1:
          message.height = longToNumber(reader.int64() as Long)
          break
        case 2:
          message.version = reader.string()
          break
        case 3:
          message.oldUpgradeHeight = longToNumber(reader.int64() as Long)
          break
        case 4:
          message.features.push(reader.string())
          break
        default:
          reader.skipType(tag & 7)
          break
      }
    }
    return message
  },

  fromJSON(object: any): Upgrade {
    return {
      height: isSet(object.height) ? Number(object.height) : 0,
      version: isSet(object.version) ? String(object.version) : '',
      oldUpgradeHeight: isSet(object.oldUpgradeHeight)
        ? Number(object.oldUpgradeHeight)
        : 0,
      features: Array.isArray(object?.features)
        ? object.features.map((e: any) => String(e))
        : [],
    }
  },

  toJSON(message: Upgrade): unknown {
    const obj: any = {}
    message.height !== undefined && (obj.height = Math.round(message.height))
    message.version !== undefined && (obj.version = message.version)
    message.oldUpgradeHeight !== undefined &&
      (obj.oldUpgradeHeight = Math.round(message.oldUpgradeHeight))
    if (message.features) {
      obj.features = message.features.map((e) => e)
    } else {
      obj.features = []
    }
    return obj
  },

  fromPartial<I extends Exact<DeepPartial<Upgrade>, I>>(object: I): Upgrade {
    const message = createBaseUpgrade()
    message.height = object.height ?? 0
    message.version = object.version ?? ''
    message.oldUpgradeHeight = object.oldUpgradeHeight ?? 0
    message.features = object.features?.map((e) => e) || []
    return message
  },
}

function createBaseMsgUpgrade(): MsgUpgrade {
  return { address: new Uint8Array(), upgrade: undefined }
}

export const MsgUpgrade = {
  encode(
    message: MsgUpgrade,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
    if (message.address.length !== 0) {
      writer.uint32(10).bytes(message.address)
    }
    if (message.upgrade !== undefined) {
      Upgrade.encode(message.upgrade, writer.uint32(18).fork()).ldelim()
    }
    return writer
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): MsgUpgrade {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input)
    let end = length === undefined ? reader.len : reader.pos + length
    const message = createBaseMsgUpgrade()
    while (reader.pos < end) {
      const tag = reader.uint32()
      switch (tag >>> 3) {
        case 1:
          message.address = reader.bytes()
          break
        case 2:
          message.upgrade = Upgrade.decode(reader, reader.uint32())
          break
        default:
          reader.skipType(tag & 7)
          break
      }
    }
    return message
  },

  fromJSON(object: any): MsgUpgrade {
    return {
      address: isSet(object.address)
        ? bytesFromBase64(object.address)
        : new Uint8Array(),
      upgrade: isSet(object.upgrade)
        ? Upgrade.fromJSON(object.upgrade)
        : undefined,
    }
  },

  toJSON(message: MsgUpgrade): unknown {
    const obj: any = {}
    message.address !== undefined &&
      (obj.address = base64FromBytes(
        message.address !== undefined ? message.address : new Uint8Array()
      ))
    message.upgrade !== undefined &&
      (obj.upgrade = message.upgrade
        ? Upgrade.toJSON(message.upgrade)
        : undefined)
    return obj
  },

  fromPartial<I extends Exact<DeepPartial<MsgUpgrade>, I>>(
    object: I
  ): MsgUpgrade {
    const message = createBaseMsgUpgrade()
    message.address = object.address ?? new Uint8Array()
    message.upgrade =
      object.upgrade !== undefined && object.upgrade !== null
        ? Upgrade.fromPartial(object.upgrade)
        : undefined
    return message
  },
}

function createBaseMsgChangeParam(): MsgChangeParam {
  return {
    FromAddress: new Uint8Array(),
    paramKey: '',
    paramVal: new Uint8Array(),
  }
}

export const MsgChangeParam = {
  encode(
    message: MsgChangeParam,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
    if (message.FromAddress.length !== 0) {
      writer.uint32(10).bytes(message.FromAddress)
    }
    if (message.paramKey !== '') {
      writer.uint32(18).string(message.paramKey)
    }
    if (message.paramVal.length !== 0) {
      writer.uint32(26).bytes(message.paramVal)
    }
    return writer
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): MsgChangeParam {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input)
    let end = length === undefined ? reader.len : reader.pos + length
    const message = createBaseMsgChangeParam()
    while (reader.pos < end) {
      const tag = reader.uint32()
      switch (tag >>> 3) {
        case 1:
          message.FromAddress = reader.bytes()
          break
        case 2:
          message.paramKey = reader.string()
          break
        case 3:
          message.paramVal = reader.bytes()
          break
        default:
          reader.skipType(tag & 7)
          break
      }
    }
    return message
  },

  fromJSON(object: any): MsgChangeParam {
    return {
      FromAddress: isSet(object.FromAddress)
        ? bytesFromBase64(object.FromAddress)
        : new Uint8Array(),
      paramKey: isSet(object.paramKey) ? String(object.paramKey) : '',
      paramVal: isSet(object.paramVal)
        ? bytesFromBase64(object.paramVal)
        : new Uint8Array(),
    }
  },

  toJSON(message: MsgChangeParam): unknown {
    const obj: any = {}
    message.FromAddress !== undefined &&
      (obj.FromAddress = base64FromBytes(
        message.FromAddress !== undefined
          ? message.FromAddress
          : new Uint8Array()
      ))
    message.paramKey !== undefined && (obj.paramKey = message.paramKey)
    message.paramVal !== undefined &&
      (obj.paramVal = base64FromBytes(
        message.paramVal !== undefined ? message.paramVal : new Uint8Array()
      ))
    return obj
  },

  fromPartial<I extends Exact<DeepPartial<MsgChangeParam>, I>>(
    object: I
  ): MsgChangeParam {
    const message = createBaseMsgChangeParam()
    message.FromAddress = object.FromAddress ?? new Uint8Array()
    message.paramKey = object.paramKey ?? ''
    message.paramVal = object.paramVal ?? new Uint8Array()
    return message
  },
}

declare var self: any | undefined
declare var window: any | undefined
declare var global: any | undefined
var globalThis: any = (() => {
  if (typeof globalThis !== 'undefined') return globalThis
  if (typeof self !== 'undefined') return self
  if (typeof window !== 'undefined') return window
  if (typeof global !== 'undefined') return global
  throw 'Unable to locate global object'
})()

const atob: (b64: string) => string =
  globalThis.atob ||
  ((b64) => globalThis.Buffer.from(b64, 'base64').toString('binary'))
function bytesFromBase64(b64: string): Uint8Array {
  const bin = atob(b64)
  const arr = new Uint8Array(bin.length)
  for (let i = 0; i < bin.length; ++i) {
    arr[i] = bin.charCodeAt(i)
  }
  return arr
}

const btoa: (bin: string) => string =
  globalThis.btoa ||
  ((bin) => globalThis.Buffer.from(bin, 'binary').toString('base64'))
function base64FromBytes(arr: Uint8Array): string {
  const bin: string[] = []
  arr.forEach((byte) => {
    bin.push(String.fromCharCode(byte))
  })
  return btoa(bin.join(''))
}

type Builtin =
  | Date
  | Function
  | Uint8Array
  | string
  | number
  | boolean
  | undefined

export type DeepPartial<T> = T extends Builtin
  ? T
  : T extends Array<infer U>
  ? Array<DeepPartial<U>>
  : T extends ReadonlyArray<infer U>
  ? ReadonlyArray<DeepPartial<U>>
  : T extends {}
  ? { [K in keyof T]?: DeepPartial<T[K]> }
  : Partial<T>

type KeysOfUnion<T> = T extends T ? keyof T : never
export type Exact<P, I extends P> = P extends Builtin
  ? P
  : P & { [K in keyof P]: Exact<P[K], I[K]> } & Record<
        Exclude<keyof I, KeysOfUnion<P>>,
        never
      >

function longToNumber(long: Long): number {
  if (long.gt(Number.MAX_SAFE_INTEGER)) {
    throw new globalThis.Error('Value is larger than Number.MAX_SAFE_INTEGER')
  }
  return long.toNumber()
}

// If you get a compile-error about 'Constructor<Long> and ... have no overlap',
// add '--ts_proto_opt=esModuleInterop=true' as a flag when calling 'protoc'.
if (_m0.util.Long !== Long) {
  _m0.util.Long = Long as any
  _m0.configure()
}

function isSet(value: any): boolean {
  return value !== null && value !== undefined
}
