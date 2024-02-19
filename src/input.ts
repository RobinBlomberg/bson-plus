import type { Type } from './type.js';

export type InputFor = {
  [Type.BigInt]: bigint;
  [Type.BigInt64]: bigint;
  [Type.BigUint]: bigint;
  [Type.BigUint64]: bigint;
  [Type.Bitset]: number[];
  [Type.Decimal]: number;
  [Type.Float32]: number;
  [Type.Float64]: number;
  [Type.Int]: bigint | number;
  [Type.Int8]: number;
  [Type.Int16]: number;
  [Type.Int32]: number;
  [Type.SmallInt]: number;
  [Type.SmallUint]: number;
  [Type.String]: string;
  [Type.String256]: string;
  [Type.Uint]: bigint | number;
  [Type.Uint8]: number;
  [Type.Uint16]: number;
  [Type.Uint32]: number;
};
