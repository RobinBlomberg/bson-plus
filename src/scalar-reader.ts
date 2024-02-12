import os from 'os';
import { ScalarType, type Scalar } from './scalar.js';

const IS_OS_LITTLE_ENDIAN = os.endianness() === 'LE';

export class ScalarReader {
  readonly #buffer: Buffer;
  #offset: number;

  constructor(buffer: Buffer) {
    this.#buffer = buffer;
    this.#offset = 0;
  }

  readBitArray(length: number) {
    const value: number[] = new Array(length);
    let i = 0;
    while (i < length) {
      const byte = this.#buffer.readUint8(this.#offset);
      this.#offset += 1;
      const byteLength = Math.min(length - i, 8);
      for (let j = 0; j < byteLength; j++) {
        value[i] = (byte >> (7 - j)) & 1;
        i++;
      }
    }
    return value;
  }

  readFloat32() {
    const value = this.#buffer.readFloatBE(this.#offset);
    this.#offset += 4;
    return value;
  }

  readFloat64() {
    const value = this.#buffer.readDoubleBE(this.#offset);
    this.#offset += 8;
    return value;
  }

  readInt(length: number) {
    const value = this.#buffer.readIntBE(this.#offset, length);
    this.#offset += length;
    return value;
  }

  readInt8() {
    const value = this.#buffer.readInt8(this.#offset);
    this.#offset += 1;
    return value;
  }

  readInt16() {
    const value = this.#buffer.readInt16BE(this.#offset);
    this.#offset += 2;
    return value;
  }

  readInt32() {
    const value = this.#buffer.readInt32BE(this.#offset);
    this.#offset += 4;
    return value;
  }

  readInt64() {
    const value = this.#buffer.readBigInt64BE(this.#offset);
    this.#offset += 8;
    return value;
  }

  readScalar(scalar: Scalar) {
    switch (scalar[0]) {
      case ScalarType.BIT_ARRAY:
        return this.readBitArray(scalar[1]);
      case ScalarType.FLOAT32:
        return this.readFloat32();
      case ScalarType.FLOAT64:
        return this.readFloat64();
      case ScalarType.INT:
        return this.readInt(scalar[1]);
      case ScalarType.INT8:
        return this.readInt8();
      case ScalarType.INT16:
        return this.readInt16();
      case ScalarType.INT32:
        return this.readInt32();
      case ScalarType.INT64:
        return this.readInt64();
      case ScalarType.SIGNED_VLQ:
        return this.readSignedVlq();
      case ScalarType.STRING:
        return this.readString(scalar[1]);
      case ScalarType.UINT:
        return this.readUint(scalar[1]);
      case ScalarType.UINT8:
        return this.readUint8();
      case ScalarType.UINT16:
        return this.readUint16();
      case ScalarType.UINT32:
        return this.readUint32();
      case ScalarType.UINT64:
        return this.readUint64();
      case ScalarType.VLQ:
        return this.readVlq();
    }
  }

  readScalars(scalars: Scalar[]) {
    return scalars.map((scalar) => {
      return this.readScalar(scalar);
    });
  }

  // https://en.wikipedia.org/wiki/Variable-length_quantity#Signed_numbers
  readSignedVlq() {
    let byte = this.#buffer.readUint8(this.#offset);
    this.#offset += 1;
    const sign = byte & 0b0100_0000;
    let value = byte & 0b0011_1111;
    while (byte & 0b1000_0000) {
      byte = this.#buffer.readUint8(this.#offset);
      this.#offset += 1;
      value = (value << 7) | (byte & 0b0111_1111);
    }
    return sign ? -value : value;
  }

  readString(length: number) {
    const value = IS_OS_LITTLE_ENDIAN
      ? this.#buffer
          .subarray(this.#offset, this.#offset + length)
          .reverse()
          .toString('utf8')
      : this.#buffer.toString('utf8', this.#offset, this.#offset + length);
    this.#offset += length;
    return value;
  }

  readUint(length: number) {
    const value = this.#buffer.readUintBE(this.#offset, length);
    this.#offset += length;
    return value;
  }

  readUint8() {
    const value = this.#buffer.readUint8(this.#offset);
    this.#offset += 1;
    return value;
  }

  readUint16() {
    const value = this.#buffer.readUint16BE(this.#offset);
    this.#offset += 2;
    return value;
  }

  readUint32() {
    const value = this.#buffer.readUint32BE(this.#offset);
    this.#offset += 4;
    return value;
  }

  readUint64() {
    const value = this.#buffer.readBigUint64BE(this.#offset);
    this.#offset += 8;
    return value;
  }

  // https://en.wikipedia.org/wiki/Variable-length_quantity
  readVlq() {
    let value = 0;
    let byte;
    do {
      byte = this.#buffer.readUint8(this.#offset);
      this.#offset += 1;
      value = (value << 7) | (byte & 0b0111_1111);
    } while (byte & 0b1000_0000);
    return value;
  }
}
