export type Scalar =
  | readonly [ScalarType.BIT_ARRAY, length: number]
  | readonly [ScalarType.FLOAT32]
  | readonly [ScalarType.FLOAT64]
  | readonly [ScalarType.INT, length: number]
  | readonly [ScalarType.INT8]
  | readonly [ScalarType.INT16]
  | readonly [ScalarType.INT32]
  | readonly [ScalarType.INT64]
  | readonly [ScalarType.SIGNED_VLQ]
  | readonly [ScalarType.STRING, length: number]
  | readonly [ScalarType.UINT, length: number]
  | readonly [ScalarType.UINT8]
  | readonly [ScalarType.UINT16]
  | readonly [ScalarType.UINT32]
  | readonly [ScalarType.UINT64]
  | readonly [ScalarType.VLQ];

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
