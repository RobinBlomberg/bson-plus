export const enum DataType {
  Float32,
  Float64,
  Int8,
  Int16,
  Int32,
  Int64,
  SignedVLQ,
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
  [DataType.SignedVLQ]: number;
  [DataType.Uint8]: number;
  [DataType.Uint16]: number;
  [DataType.Uint32]: number;
  [DataType.Uint64]: bigint;
  [DataType.VLQ]: number;
};

export class Codec {
  #offset: number;
  readonly #view: DataView;

  constructor(buffer: ArrayBuffer) {
    this.#offset = 0;
    this.#view = new DataView(buffer);
  }

  read<Type extends DataType>(type: Type) {
    switch (type) {
      case DataType.Float32: {
        const value = this.#view.getFloat32(this.#offset);
        this.#offset += 4;
        return value;
      }
      case DataType.Float64: {
        const value = this.#view.getFloat64(this.#offset);
        this.#offset += 8;
        return value;
      }
      case DataType.Int8: {
        const value = this.#view.getInt8(this.#offset);
        this.#offset += 1;
        return value;
      }
      case DataType.Int16: {
        const value = this.#view.getInt16(this.#offset);
        this.#offset += 2;
        return value;
      }
      case DataType.Int32: {
        const value = this.#view.getInt32(this.#offset);
        this.#offset += 4;
        return value;
      }
      case DataType.Int64: {
        const value = this.#view.getBigInt64(this.#offset);
        this.#offset += 8;
        return value;
      }
      case DataType.SignedVLQ: {
        throw new Error('Not implemented');
      }
      case DataType.Uint8: {
        const value = this.#view.getUint8(this.#offset);
        this.#offset += 1;
        return value;
      }
      case DataType.Uint16: {
        const value = this.#view.getUint16(this.#offset);
        this.#offset += 2;
        return value;
      }
      case DataType.Uint32: {
        const value = this.#view.getUint32(this.#offset);
        this.#offset += 4;
        return value;
      }
      case DataType.Uint64: {
        const value = this.#view.getBigUint64(this.#offset);
        this.#offset += 8;
        return value;
      }
      case DataType.VLQ: {
        let value = 0;
        let byte;
        do {
          byte = this.#view.getUint8(this.#offset);
          this.#offset += 1;
          value = (value << 7) | (byte & 127);
        } while (byte & 128);
        return value;
      }
    }
  }

  reset() {
    this.#offset = 0;
  }

  write<Type extends DataType>(type: Type, value: DataTypeValueMap[Type]) {
    const v = value as any;
    switch (type) {
      case DataType.Float32:
        this.#view.setFloat32(this.#offset, v);
        this.#offset += 4;
        return this.#offset;
      case DataType.Float64:
        this.#view.setFloat64(this.#offset, v);
        this.#offset += 8;
        return this.#offset;
      case DataType.Int8:
        this.#view.setInt8(this.#offset, v);
        this.#offset += 1;
        return this.#offset;
      case DataType.Int16:
        this.#view.setInt16(this.#offset, v);
        this.#offset += 2;
        return this.#offset;
      case DataType.Int32:
        this.#view.setInt32(this.#offset, v);
        this.#offset += 4;
        return this.#offset;
      case DataType.Int64:
        this.#view.setBigInt64(this.#offset, v);
        this.#offset += 8;
        return this.#offset;
      case DataType.SignedVLQ: {
        throw new Error('Not implemented');
      }
      case DataType.Uint8:
        this.#view.setUint8(this.#offset, v);
        this.#offset += 1;
        return this.#offset;
      case DataType.Uint16:
        this.#view.setUint16(this.#offset, v);
        this.#offset += 2;
        return this.#offset;
      case DataType.Uint32:
        this.#view.setUint32(this.#offset, v);
        this.#offset += 4;
        return this.#offset;
      case DataType.Uint64:
        this.#view.setBigUint64(this.#offset, v);
        this.#offset += 8;
        return this.#offset;
      case DataType.VLQ: {
        if (v >= 2_147_483_648) {
          throw new RangeError(`Value is out of range for VLQ: ${v}`);
        }
        // prettier-ignore
        let shift = v >= 268_435_456 ? 28 : v >= 2_097_152 ? 21 : v >= 16_384 ? 14 : v >= 128 ? 7 : 0;
        while (shift > 0) {
          this.#view.setUint8(this.#offset, (v >> shift) | 128);
          this.#offset += 1;
          shift -= 7;
        }
        this.#view.setUint8(this.#offset, v & 127);
        this.#offset += 1;
        return this.#offset;
      }
    }
  }
}
