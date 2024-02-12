import { DataType, UnknownSchema } from '../models.js';

export class BufferAdapter {
  readonly #buffer: Buffer;
  #offset: number;

  constructor(buffer: Buffer) {
    this.#buffer = buffer;
    this.#offset = 0;
  }

  #readVlq() {
    let value = 0;
    while (true) {
      const byte = this.#buffer.readUInt8(this.#offset);
      this.#offset += 1;
      value = (value << 7) | (byte & 127);
      if (byte < 128) break;
    }
    return value;
  }

  read(schema = UnknownSchema()) {
    switch (schema[0]) {
      case DataType.ARRAY: {
        const length = this.#readVlq();
        const elements = schema[1];
        const result = new Array(length);
        for (let i = 0; i < length; i++) {
          result[i] = this.read(elements);
        }
        return result;
      }
      case DataType.BOOLEAN: {
        const value = this.#buffer.readUInt8(this.#offset);
        this.#offset += 1;
        return value !== 0;
      }
      case DataType.DOUBLE: {
        const value = this.#buffer.readDoubleBE(this.#offset);
        this.#offset += 8;
        return value;
      }
      case DataType.ENUM: {
        return schema[2][this.#readVlq()];
      }
      case DataType.ENUM_TYPED: {
        return schema[3][this.#readVlq()];
      }
      case DataType.INT8: {
        const value = this.#buffer.readInt8(this.#offset);
        this.#offset += 1;
        return value;
      }
      case DataType.INT16: {
        const value = this.#buffer.readInt16BE(this.#offset);
        this.#offset += 2;
        return value;
      }
      case DataType.INT32: {
        const value = this.#buffer.readInt32BE(this.#offset);
        this.#offset += 4;
        return value;
      }
      case DataType.STRING: {
        const length = this.#readVlq();
        const value = this.#buffer.toString(
          'utf8',
          this.#offset,
          this.#offset + length,
        );
        this.#offset += length;
        return value;
      }
      case DataType.TUPLE: {
        const length = schema[1];
        const value = new Array(length);
        for (let i = 0; i < length; i++) {
          value[i] = this.read(schema[2][i]);
        }
        return value;
      }
      case DataType.TUPLE_PARTIAL: {
        const minLength = schema[1];
        const value = new Array(minLength);
        for (let i = 0; i < minLength; i++) {
          value[i] = this.read(schema[2][i]);
        }
        const optionalLength = this.#readVlq();
        for (let i = 0; i < optionalLength; i++) {
          value.push(this.read());
        }
        return value;
      }
      case DataType.UINT8: {
        const value = this.#buffer.readUInt8(this.#offset);
        this.#offset += 1;
        return value;
      }
      case DataType.UINT16: {
        const value = this.#buffer.readUInt16BE(this.#offset);
        this.#offset += 2;
        return value;
      }
      case DataType.UINT32: {
        const value = this.#buffer.readUInt32BE(this.#offset);
        this.#offset += 4;
        return value;
      }
      case DataType.UINT64: {
        const value = this.#buffer.readBigUInt64BE(this.#offset);
        this.#offset += 8;
        return value;
      }
      case DataType.UNKNOWN: {
        const type = this.#buffer.readUInt8(this.#offset);
        this.#offset += 1;
        break;
      }
      case DataType.VLQ: {
        return this.#readVlq();
      }
    }
  }
}
