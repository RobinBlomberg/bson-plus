import type { DataType } from './enums.js';

export type BigIntDataType = DataType.INT64 | DataType.UINT64;

export type DataValueOfType<Type extends DataType> = Type extends BigIntDataType
  ? bigint
  : number;

export type DataValuesOfTypes<Types extends DataType[]> = Types extends [
  infer First extends DataType,
  ...infer Rest extends DataType[],
]
  ? [DataValueOfType<First>, ...DataValuesOfTypes<Rest>]
  : [];
