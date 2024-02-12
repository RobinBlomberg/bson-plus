import { type Scalar } from './scalar.js';

export class ScalarReader {
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
  }

  writeFloat32(value: number) {
    this.#buffer.writeFloatBE(value, this.#offset);
    this.#offset += 4;
  }

  writeFloat64(value: number) {
    this.#buffer.writeDoubleBE(value, this.#offset);
    this.#offset += 8;
  }

  writeInt(value: number, length: number) {
    this.#buffer.writeIntBE(value, this.#offset, length);
    this.#offset += length;
  }

  writeInt8(value: number) {
    this.#buffer.writeInt8(value, this.#offset);
    this.#offset += 1;
  }

  writeInt16(value: number) {
    this.#buffer.writeInt16BE(value, this.#offset);
    this.#offset += 2;
  }

  writeInt32(value: number) {
    this.#buffer.writeInt32BE(value, this.#offset);
    this.#offset += 4;
  }

  writeInt64(value: bigint) {
    this.#buffer.writeBigInt64BE(value, this.#offset);
    this.#offset += 8;
  }

  writeScalar(scalar: Scalar) {
    // switch (scalar[0]) {
    //   case ScalarType.BIT_ARRAY:
    //     return this.writeBitArray(scalar[1]);
    //   case ScalarType.FLOAT32:
    //     return this.writeFloat32();
    //   case ScalarType.FLOAT64:
    //     return this.writeFloat64();
    //   case ScalarType.INT:
    //     return this.writeInt(scalar[1]);
    //   case ScalarType.INT8:
    //     return this.writeInt8();
    //   case ScalarType.INT16:
    //     return this.writeInt16();
    //   case ScalarType.INT32:
    //     return this.writeInt32();
    //   case ScalarType.INT64:
    //     return this.writeInt64();
    //   case ScalarType.STRING:
    //     return this.writeString(scalar[1]);
    //   case ScalarType.UINT:
    //     return this.writeUint(scalar[1]);
    //   case ScalarType.UINT8:
    //     return this.writeUint8();
    //   case ScalarType.UINT16:
    //     return this.writeUint16();
    //   case ScalarType.UINT32:
    //     return this.writeUint32();
    //   case ScalarType.UINT64:
    //     return this.writeUint64();
    //   case ScalarType.VLQ:
    //     return this.writeVlq();
    // }
  }

  writeScalars(scalars: Scalar[]) {
    // for (const value of values) {
    // }
  }

  writeString(value: string, length: number) {
    // this.#buffer.toString(
    //   'utf8',
    //   this.#offset,
    //   this.#offset + length,
    // );
    // this.#offset += length;
    // return value;
  }

  writeUint(value: number, length: number) {
    this.#buffer.writeUintBE(value, this.#offset, length);
    this.#offset += length;
  }

  writeUint8(value: number) {
    this.#buffer.writeUint8(value, this.#offset);
    this.#offset += 1;
  }

  writeUint16(value: number) {
    this.#buffer.writeUint16BE(value, this.#offset);
    this.#offset += 2;
  }

  writeUint32(value: number) {
    this.#buffer.writeUint32BE(value, this.#offset);
    this.#offset += 4;
  }

  writeUint64(value: bigint) {
    this.#buffer.writeBigUint64BE(value, this.#offset);
    this.#offset += 8;
  }

  writeVlq(value: number) {
    // let value = 0;
    // while (true) {
    //   const byte = this.#buffer.writeUint8(this.#offset);
    //   this.#offset += 1;
    //   value = (value << 7) | (byte & 127);
    //   if (byte < 128) break;
    // }
    // return value;
  }
}
