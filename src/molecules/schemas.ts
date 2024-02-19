import type { DataType } from '../data-type.js';

export type NumberSchema = {
  type:
    | DataType.Decimal
    | DataType.Float64
    | DataType.Int
    | DataType.Int8
    | DataType.Uint
    | DataType.Uint8;
};

export type Schema = NumberSchema | StringSchema;

export type StringSchema = {
  type: DataType.String | DataType.String256;
  length?: number;
};
