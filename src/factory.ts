import { ScalarType } from './scalar.js';

export const $ = {
  bitArray: (length: number) => [ScalarType.BIT_ARRAY, length] as const,
  float32: () => [ScalarType.FLOAT32] as const,
  float64: () => [ScalarType.FLOAT64] as const,
  int: (length: number) => [ScalarType.INT, length] as const,
  int8: () => [ScalarType.INT8] as const,
  int16: () => [ScalarType.INT16] as const,
  int32: () => [ScalarType.INT32] as const,
  int64: () => [ScalarType.INT64] as const,
  signedVlq: () => [ScalarType.SIGNED_VLQ] as const,
  string: (length: number) => [ScalarType.STRING, length] as const,
  uint: (length: number) => [ScalarType.UINT, length] as const,
  uint8: () => [ScalarType.UINT8] as const,
  uint16: () => [ScalarType.UINT16] as const,
  uint32: () => [ScalarType.UINT32] as const,
  uint64: () => [ScalarType.UINT64] as const,
  vlq: () => [ScalarType.VLQ] as const,
};
