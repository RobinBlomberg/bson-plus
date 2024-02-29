export type Codec<T> = {
  read: (iterator: CodecIterator) => T;
  write: (iterator: CodecIterator, value: T) => void;
};

export type CodecIterator = {
  dataView: DataView;
  offset: number;
};

export const bigint64Codec: Codec<bigint> = {
  read(iterator) {
    const value = iterator.dataView.getBigInt64(iterator.offset);
    iterator.offset += 8;
    return value;
  },
  write(iterator, value) {
    iterator.dataView.setBigInt64(iterator.offset, value);
    iterator.offset += 8;
  },
};

export const biguint64Codec: Codec<bigint> = {
  read(iterator) {
    const value = iterator.dataView.getBigUint64(iterator.offset);
    iterator.offset += 8;
    return value;
  },
  write(iterator, value) {
    iterator.dataView.setBigUint64(iterator.offset, value);
    iterator.offset += 8;
  },
};

export const biguintvCodec: Codec<bigint> = {
  read(iterator) {
    const dataView = iterator.dataView;
    let shift = 0n;
    let value = 0n;
    while (true) {
      const byte = dataView.getUint8(iterator.offset++);
      value |= BigInt(byte & 0b0111_1111) << shift;
      if ((byte & 0b1000_0000) === 0) return value;
      shift += 7n;
    }
  },
  write(iterator, value) {
    const dataView = iterator.dataView;
    do {
      let byte = Number(value & 0b0111_1111n);
      value >>= 7n;
      if (value !== 0n) byte |= 0b1000_0000;
      dataView.setUint8(iterator.offset++, byte);
    } while (value !== 0n);
  },
};

export const int8Codec: Codec<number> = {
  read(iterator) {
    return iterator.dataView.getInt8(iterator.offset++);
  },
  write(iterator, value) {
    iterator.dataView.setInt8(iterator.offset++, value);
  },
};

export const int16Codec: Codec<number> = {
  read(iterator) {
    const value = iterator.dataView.getInt16(iterator.offset);
    iterator.offset += 2;
    return value;
  },
  write(iterator, value) {
    iterator.dataView.setInt16(iterator.offset, value);
    iterator.offset += 2;
  },
};

export const int32Codec: Codec<number> = {
  read(iterator) {
    const value = iterator.dataView.getInt32(iterator.offset);
    iterator.offset += 4;
    return value;
  },
  write(iterator, value) {
    iterator.dataView.setInt32(iterator.offset, value);
    iterator.offset += 4;
  },
};

export const uint8Codec: Codec<number> = {
  read(iterator) {
    return iterator.dataView.getUint8(iterator.offset++);
  },
  write(iterator, value) {
    iterator.dataView.setUint8(iterator.offset++, value);
  },
};

export const uint16Codec: Codec<number> = {
  read(iterator) {
    const value = iterator.dataView.getUint16(iterator.offset);
    iterator.offset += 2;
    return value;
  },
  write(iterator, value) {
    iterator.dataView.setUint16(iterator.offset, value);
    iterator.offset += 2;
  },
};

export const uint32Codec: Codec<number> = {
  read(iterator) {
    const value = iterator.dataView.getUint32(iterator.offset);
    iterator.offset += 4;
    return value;
  },
  write(iterator, value) {
    iterator.dataView.setUint32(iterator.offset, value);
    iterator.offset += 4;
  },
};

export const uintvCodec: Codec<number> = {
  read(iterator) {
    const dataView = iterator.dataView;
    let shift = 0;
    let value = 0;
    while (true) {
      const byte = dataView.getUint8(iterator.offset++);
      value |= (byte & 0b0111_1111) << shift;
      if ((byte & 0b1000_0000) === 0) return value;
      shift += 7;
    }
  },
  write(iterator, value) {
    const dataView = iterator.dataView;
    do {
      let byte = value & 0b0111_1111;
      value >>= 7;
      if (value !== 0) byte |= 0b1000_0000;
      dataView.setUint8(iterator.offset++, byte);
    } while (value !== 0);
  },
};
