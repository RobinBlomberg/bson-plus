import type { DataType } from './enums.js';

export type BigIntDataType = DataType.INT64 | DataType.UINT64;

export type DataValue<Type extends DataType = DataType> =
  Type extends BigIntDataType ? bigint : number;

export type DataValuesOfTypes<Types extends readonly DataType[]> =
  Types extends readonly [
    infer First extends DataType,
    ...infer Rest extends DataType[],
  ]
    ? [DataValue<First>, ...DataValuesOfTypes<Rest>]
    : DataType[] extends Types
      ? DataValue[]
      : [];

export type DataValuesOfTypesInput<Types extends readonly DataType[]> =
  Types extends readonly [
    infer First extends DataType,
    ...infer Rest extends DataType[],
  ]
    ? readonly [DataValue<First>, ...DataValuesOfTypes<Rest>]
    : DataValuesOfTypes<Types>;
