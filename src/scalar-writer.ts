import type { ScalarValueMap } from './scalar.js';
import { ScalarType, type Scalar } from './scalar.js';

export class ScalarWriter {
  readonly #buffer: Buffer;
  #offset: number;

  constructor(buffer: Buffer) {
    this.#buffer = buffer;
    this.#offset = 0;
  }

  writeBitArray(value: number[], length: number) {
    // const value: number[] = new Array(length);
    // let i = 0;
    // while (i < length) {
    //   const byte = this.#buffer.writeUint8(this.#offset);
    //   this.#offset += 1;
    //   const byteLength = Math.min(length - i, 8);
    //   for (let j = 0; j < byteLength; j++) {
    //     value[i] = (byte >> (7 - j)) & 1;
    //     i++;
    //   }
    // }
    // return value;
    return this.#offset;
  }

  writeFloat32(value: number) {
    this.#buffer.writeFloatBE(value, this.#offset);
    this.#offset += 4;
    return this.#offset;
  }

  writeFloat64(value: number) {
    this.#buffer.writeDoubleBE(value, this.#offset);
    this.#offset += 8;
    return this.#offset;
  }

  writeInt(value: number, length: number) {
    this.#buffer.writeIntBE(value, this.#offset, length);
    this.#offset += length;
    return this.#offset;
  }

  writeInt8(value: number) {
    this.#buffer.writeInt8(value, this.#offset);
    this.#offset += 1;
    return this.#offset;
  }

  writeInt16(value: number) {
    this.#buffer.writeInt16BE(value, this.#offset);
    this.#offset += 2;
    return this.#offset;
  }

  writeInt32(value: number) {
    this.#buffer.writeInt32BE(value, this.#offset);
    this.#offset += 4;
    return this.#offset;
  }

  writeInt64(value: bigint) {
    this.#buffer.writeBigInt64BE(value, this.#offset);
    this.#offset += 8;
    return this.#offset;
  }

  writeScalar<ThisScalar extends Scalar>(
    scalar: ThisScalar,
    value: ScalarValueMap[ThisScalar[0]],
  ) {
    switch (scalar[0]) {
      case ScalarType.BIT_ARRAY:
        return this.writeBitArray(value as any, scalar[1]);
      case ScalarType.FLOAT32:
        return this.writeFloat32(value as any);
      case ScalarType.FLOAT64:
        return this.writeFloat64(value as any);
      case ScalarType.INT:
        return this.writeInt(value as any, scalar[1]);
      case ScalarType.INT8:
        return this.writeInt8(value as any);
      case ScalarType.INT16:
        return this.writeInt16(value as any);
      case ScalarType.INT32:
        return this.writeInt32(value as any);
      case ScalarType.INT64:
        return this.writeInt64(value as any);
      case ScalarType.SIGNED_VLQ:
        return this.writeSignedVlq(value as any);
      case ScalarType.STRING:
        return this.writeString(value as any, scalar[1]);
      case ScalarType.UINT:
        return this.writeUint(value as any, scalar[1]);
      case ScalarType.UINT8:
        return this.writeUint8(value as any);
      case ScalarType.UINT16:
        return this.writeUint16(value as any);
      case ScalarType.UINT32:
        return this.writeUint32(value as any);
      case ScalarType.UINT64:
        return this.writeUint64(value as any);
      case ScalarType.VLQ:
        return this.writeVlq(value as any);
    }
  }

  writeScalars<const Scalars extends Scalar[]>(
    scalars: Scalars,
    values: { [Index in keyof Scalars]: ScalarValueMap[Scalars[Index][0]] },
  ) {
    for (const [i, scalar] of scalars.entries()) {
      this.writeScalar(scalar, values[i]!);
    }
    return this.#offset;
  }

  writeSignedVlq(value: number) {
    // let value = 0;
    // while (true) {
    //   const byte = this.#buffer.writeUint8(this.#offset);
    //   this.#offset += 1;
    //   value = (value << 7) | (byte & 127);
    //   if (byte < 128) break;
    // }
    // return value;
    return this.#offset;
  }

  writeString(value: string, length?: number) {
    const buffer = Buffer.from(value).reverse();
    if (length === undefined) {
      this.writeVlq(buffer.length);
    }
    this.#buffer.copy(buffer, this.#offset, 0, buffer.length);
    this.#offset += buffer.length;
    return this.#offset;
  }

  writeUint(value: number, length: number) {
    this.#buffer.writeUintBE(value, this.#offset, length);
    this.#offset += length;
    return this.#offset;
  }

  writeUint8(value: number) {
    this.#buffer.writeUint8(value, this.#offset);
    this.#offset += 1;
    return this.#offset;
  }

  writeUint16(value: number) {
    this.#buffer.writeUint16BE(value, this.#offset);
    this.#offset += 2;
    return this.#offset;
  }

  writeUint32(value: number) {
    this.#buffer.writeUint32BE(value, this.#offset);
    this.#offset += 4;
    return this.#offset;
  }

  writeUint64(value: bigint) {
    this.#buffer.writeBigUint64BE(value, this.#offset);
    this.#offset += 8;
    return this.#offset;
  }

  writeVlq(value: number) {
    do {
      let byte = value & 0b0111_1111;
      value >>= 7;
      if (value === 0) {
        byte &= 0b0111_1111;
      }
      this.#buffer.writeUint8(byte, this.#offset);
      this.#offset += 1;
    } while (value !== 0);
    return this.#offset;
  }
}
