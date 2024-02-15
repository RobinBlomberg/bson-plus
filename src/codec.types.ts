import type { DataType } from './codec.enums.js';

export type BigIntDataType = DataType.INT64 | DataType.UINT64;

export type Codec = {
  getOffset: () => number;
  read: <Type extends DataType>(type: Type) => DataValueInput<Type>;
  readMany: <const Types extends readonly DataType[]>(
    types: Types,
  ) => DataValueInputs<Types>;
  reset: () => void;
  write: <Type extends DataType>(
    type: Type,
    value: DataValueInput<Type>,
  ) => void;
  writeMany: <const Types extends readonly DataType[] | DataType[]>(
    types: Types,
    values: DataValueOutputs<Types>,
  ) => void;
};

export type DataValueInput<Type extends DataType = DataType> =
  Type extends BigIntDataType ? bigint : number;

export type DataValueInputs<Types extends readonly DataType[]> =
  Types extends readonly [
    infer First extends DataType,
    ...infer Rest extends DataType[],
  ]
    ? [DataValueInput<First>, ...DataValueInputs<Rest>]
    : DataType[] extends Types
      ? DataValueInput[]
      : [];

export type DataValueOutput<Type extends DataType = DataType> =
  Type extends BigIntDataType ? bigint : bigint | number;

export type DataValueOutputs<Types extends readonly DataType[]> =
  Types extends readonly [
    infer First extends DataType,
    ...infer Rest extends DataType[],
  ]
    ? readonly [DataValueOutput<First>, ...DataValueInputs<Rest>]
    : DataValueInputs<Types>;

export type NumberDataType =
  | DataType.FLOAT32
  | DataType.FLOAT64
  | DataType.INT8
  | DataType.INT16
  | DataType.INT32
  | DataType.UINT8
  | DataType.UINT16
  | DataType.UINT32
  | DataType.ULEB128;
