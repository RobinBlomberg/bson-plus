export type Scalar =
  | readonly [type: ScalarType.BIT_ARRAY, length: number]
  | readonly [type: ScalarType.FLOAT32]
  | readonly [type: ScalarType.FLOAT64]
  | readonly [type: ScalarType.INT, length: number]
  | readonly [type: ScalarType.INT8]
  | readonly [type: ScalarType.INT16]
  | readonly [type: ScalarType.INT32]
  | readonly [type: ScalarType.INT64]
  | readonly [type: ScalarType.SIGNED_VLQ]
  | readonly [type: ScalarType.STRING, length: number]
  | readonly [type: ScalarType.UINT, length: number]
  | readonly [type: ScalarType.UINT8]
  | readonly [type: ScalarType.UINT16]
  | readonly [type: ScalarType.UINT32]
  | readonly [type: ScalarType.UINT64]
  | readonly [type: ScalarType.VLQ];

/* eslint-disable @typescript-eslint/no-use-before-define */
export type ScalarValueMap = {
  [ScalarType.BIT_ARRAY]: number[];
  [ScalarType.FLOAT32]: number;
  [ScalarType.FLOAT64]: number;
  [ScalarType.INT]: number;
  [ScalarType.INT8]: number;
  [ScalarType.INT16]: number;
  [ScalarType.INT32]: number;
  [ScalarType.INT64]: bigint;
  [ScalarType.SIGNED_VLQ]: number;
  [ScalarType.STRING]: string;
  [ScalarType.UINT]: number;
  [ScalarType.UINT8]: number;
  [ScalarType.UINT16]: number;
  [ScalarType.UINT32]: number;
  [ScalarType.UINT64]: number;
  [ScalarType.VLQ]: number;
};
/* eslint-enable @typescript-eslint/no-use-before-define */

export const enum ScalarType {
  BIT_ARRAY,
  FLOAT32,
  FLOAT64,
  INT,
  INT8,
  INT16,
  INT32,
  INT64,
  SIGNED_VLQ,
  STRING,
  UINT,
  UINT8,
  UINT16,
  UINT32,
  UINT64,
  VLQ,
}
