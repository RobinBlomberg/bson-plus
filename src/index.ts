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
