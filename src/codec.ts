export const enum DataType {
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

export type DataTypeValueMap = {
  [DataType.Float32]: number;
  [DataType.Float64]: number;
  [DataType.Int8]: number;
  [DataType.Int16]: number;
  [DataType.Int32]: number;
  [DataType.Int64]: bigint;
  [DataType.Uint8]: number;
  [DataType.Uint16]: number;
  [DataType.Uint32]: number;
  [DataType.Uint64]: bigint;
  [DataType.VLQ]: number;
};

export const read = <Type extends DataType>(
  view: DataView,
  offset: number,
  type: Type,
) => {
  switch (type) {
    case DataType.Float32: {
      const value = view.getFloat32(offset);
      offset += 4;
      return value;
    }
    case DataType.Float64: {
      const value = view.getFloat64(offset);
      offset += 8;
      return value;
    }
    case DataType.Int8: {
      const value = view.getInt8(offset);
      offset += 1;
      return value;
    }
    case DataType.Int16: {
      const value = view.getInt16(offset);
      offset += 2;
      return value;
    }
    case DataType.Int32: {
      const value = view.getInt32(offset);
      offset += 4;
      return value;
    }
    case DataType.Int64: {
      const value = view.getBigInt64(offset);
      offset += 8;
      return value;
    }
    case DataType.Uint8: {
      const value = view.getUint8(offset);
      offset += 1;
      return value;
    }
    case DataType.Uint16: {
      const value = view.getUint16(offset);
      offset += 2;
      return value;
    }
    case DataType.Uint32: {
      const value = view.getUint32(offset);
      offset += 4;
      return value;
    }
    case DataType.Uint64: {
      const value = view.getBigUint64(offset);
      offset += 8;
      return value;
    }
    case DataType.VLQ: {
      let value = 0;
      let byte;
      do {
        byte = view.getUint8(offset);
        offset += 1;
        value = (value << 7) | (byte & 127);
      } while (byte & 128);
      return value;
    }
    default:
      throw new Error('Invalid type');
  }
};

export const write = <Type extends DataType>(
  view: DataView,
  offset: number,
  type: Type,
  value: DataTypeValueMap[Type],
) => {
  const v = value as any;
  switch (type) {
    case DataType.Float32:
      view.setFloat32(offset, v);
      offset += 4;
      return offset;
    case DataType.Float64:
      view.setFloat64(offset, v);
      offset += 8;
      return offset;
    case DataType.Int8:
      view.setInt8(offset, v);
      offset += 1;
      return offset;
    case DataType.Int16:
      view.setInt16(offset, v);
      offset += 2;
      return offset;
    case DataType.Int32:
      view.setInt32(offset, v);
      offset += 4;
      return offset;
    case DataType.Int64:
      view.setBigInt64(offset, v);
      offset += 8;
      return offset;
    case DataType.Uint8:
      view.setUint8(offset, v);
      offset += 1;
      return offset;
    case DataType.Uint16:
      view.setUint16(offset, v);
      offset += 2;
      return offset;
    case DataType.Uint32:
      view.setUint32(offset, v);
      offset += 4;
      return offset;
    case DataType.Uint64:
      view.setBigUint64(offset, v);
      offset += 8;
      return offset;
    case DataType.VLQ: {
      if (v >= 2_147_483_648) {
        throw new RangeError(`Value is out of range for VLQ: ${v}`);
      }
      // prettier-ignore
      let shift = v < 128 ? 0 : v < 16_384 ? 7 : v < 2_097_152 ? 14 : v < 268_435_456 ? 21 : 28
      while (shift > 0) {
        view.setUint8(offset, (v >> shift) | 128);
        offset += 1;
        shift -= 7;
      }
      view.setUint8(offset, v & 127);
      offset += 1;
      return offset;
    }
    default:
      throw new Error('Invalid type');
  }
};
