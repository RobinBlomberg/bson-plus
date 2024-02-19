import type { Type } from './type.js';

export type BigIntSchema =
  | { type: Type.BigInt }
  | { type: Type.BigInt64 }
  | { type: Type.BigUint }
  | { type: Type.BigUint64 };

export type BitsetSchema = { type: Type.Bitset; valueLengths: number[] };

export type NumberSchema = {
  type:
    | Type.Decimal
    | Type.Float32
    | Type.Float64
    | Type.Int
    | Type.Int8
    | Type.Int16
    | Type.Int32
    | Type.SmallInt
    | Type.SmallUint
    | Type.Uint
    | Type.Uint8
    | Type.Uint16
    | Type.Uint32;
};

export type Schema = BigIntSchema | BitsetSchema | NumberSchema | StringSchema;

export type StringSchema =
  | { type: Type.String; length?: number }
  | { type: Type.String256; length?: number };
