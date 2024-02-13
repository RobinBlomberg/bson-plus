import type { Iterator } from './iterator.js';

export const enum PrimitiveType {
  Float32,
  Float64,
  Int8,
  Int16,
  Int32,
  Int64,
  Uint8,
  Uint16,
  Uint32,
  Uint64,
  VLQ,
}

export type PrimitiveTypeValueMap = {
  [PrimitiveType.Float32]: number;
  [PrimitiveType.Float64]: number;
  [PrimitiveType.Int8]: number;
  [PrimitiveType.Int16]: number;
  [PrimitiveType.Int32]: number;
  [PrimitiveType.Int64]: bigint;
  [PrimitiveType.Uint8]: number;
  [PrimitiveType.Uint16]: number;
  [PrimitiveType.Uint32]: number;
  [PrimitiveType.Uint64]: bigint;
  [PrimitiveType.VLQ]: number;
};

export const readPrimitive = <Type extends PrimitiveType>(
  iterator: Iterator,
  type: Type,
) => {
  switch (type) {
    case PrimitiveType.Float32: {
      const value = iterator.view.getFloat32(iterator.offset);
      iterator.offset += 4;
      return value as PrimitiveTypeValueMap[Type];
    }
    case PrimitiveType.Float64: {
      const value = iterator.view.getFloat64(iterator.offset);
      iterator.offset += 8;
      return value as PrimitiveTypeValueMap[Type];
    }
    case PrimitiveType.Int8: {
      const value = iterator.view.getInt8(iterator.offset);
      iterator.offset += 1;
      return value as PrimitiveTypeValueMap[Type];
    }
    case PrimitiveType.Int16: {
      const value = iterator.view.getInt16(iterator.offset);
      iterator.offset += 2;
      return value as PrimitiveTypeValueMap[Type];
    }
    case PrimitiveType.Int32: {
      const value = iterator.view.getInt32(iterator.offset);
      iterator.offset += 4;
      return value as PrimitiveTypeValueMap[Type];
    }
    case PrimitiveType.Int64: {
      const value = iterator.view.getBigInt64(iterator.offset);
      iterator.offset += 8;
      return value as PrimitiveTypeValueMap[Type];
    }
    case PrimitiveType.Uint8: {
      const value = iterator.view.getUint8(iterator.offset);
      iterator.offset += 1;
      return value as PrimitiveTypeValueMap[Type];
    }
    case PrimitiveType.Uint16: {
      const value = iterator.view.getUint16(iterator.offset);
      iterator.offset += 2;
      return value as PrimitiveTypeValueMap[Type];
    }
    case PrimitiveType.Uint32: {
      const value = iterator.view.getUint32(iterator.offset);
      iterator.offset += 4;
      return value as PrimitiveTypeValueMap[Type];
    }
    case PrimitiveType.Uint64: {
      const value = iterator.view.getBigUint64(iterator.offset);
      iterator.offset += 8;
      return value as PrimitiveTypeValueMap[Type];
    }
    case PrimitiveType.VLQ: {
      let value = 0;
      let byte;
      do {
        byte = iterator.view.getUint8(iterator.offset);
        iterator.offset += 1;
        value = (value << 7) | (byte & 127);
      } while (byte & 128);
      return value as PrimitiveTypeValueMap[Type];
    }
    default:
      throw new Error('Invalid type');
  }
};

export const writePrimitive = <Type extends PrimitiveType>(
  iterator: Iterator,
  type: Type,
  value: PrimitiveTypeValueMap[Type],
) => {
  const v = value as any;
  switch (type) {
    case PrimitiveType.Float32:
      iterator.view.setFloat32(iterator.offset, v);
      iterator.offset += 4;
      return iterator.offset;
    case PrimitiveType.Float64:
      iterator.view.setFloat64(iterator.offset, v);
      iterator.offset += 8;
      return iterator.offset;
    case PrimitiveType.Int8:
      iterator.view.setInt8(iterator.offset, v);
      iterator.offset += 1;
      return iterator.offset;
    case PrimitiveType.Int16:
      iterator.view.setInt16(iterator.offset, v);
      iterator.offset += 2;
      return iterator.offset;
    case PrimitiveType.Int32:
      iterator.view.setInt32(iterator.offset, v);
      iterator.offset += 4;
      return iterator.offset;
    case PrimitiveType.Int64:
      iterator.view.setBigInt64(iterator.offset, v);
      iterator.offset += 8;
      return iterator.offset;
    case PrimitiveType.Uint8:
      iterator.view.setUint8(iterator.offset, v);
      iterator.offset += 1;
      return iterator.offset;
    case PrimitiveType.Uint16:
      iterator.view.setUint16(iterator.offset, v);
      iterator.offset += 2;
      return iterator.offset;
    case PrimitiveType.Uint32:
      iterator.view.setUint32(iterator.offset, v);
      iterator.offset += 4;
      return iterator.offset;
    case PrimitiveType.Uint64:
      iterator.view.setBigUint64(iterator.offset, v);
      iterator.offset += 8;
      return iterator.offset;
    case PrimitiveType.VLQ: {
      if (v >= 2_147_483_648) {
        throw new RangeError(`Value is out of range for VLQ: ${v}`);
      }
      // prettier-ignore
      let shift = v < 128 ? 0 : v < 16_384 ? 7 : v < 2_097_152 ? 14 : v < 268_435_456 ? 21 : 28
      while (shift > 0) {
        iterator.view.setUint8(iterator.offset, (v >> shift) | 128);
        iterator.offset += 1;
        shift -= 7;
      }
      iterator.view.setUint8(iterator.offset, v & 127);
      iterator.offset += 1;
      return iterator.offset;
    }
    default:
      throw new Error('Invalid type');
  }
};
