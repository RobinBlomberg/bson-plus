import { DataType } from './codec.enums.js';
import type { Codec } from './codec.types.js';
import { ValueType } from './value.enums.js';
import type { Value } from './value.types.js';

export const createSchemaView = (codec: Codec) => {
  const float32Array = new Float32Array(1);
  const codecWrite = codec.write;
  const has = Object.hasOwn;
  const isArray = Array.isArray;

  const getOffset = codec.getOffset;

  const read = () => {
    const type = codec.read(DataType.UINT8);
    switch (type) {
      case ValueType.NULL:
        return null;
      case ValueType.FALSE:
        return false;
      case ValueType.TRUE:
        return true;
      case ValueType.UINT8:
        return codec.read(DataType.UINT8);
      case ValueType.UINT16:
        return codec.read(DataType.UINT16);
      case ValueType.UINT32:
        return codec.read(DataType.UINT32);
      case ValueType.UINT64:
        return codec.read(DataType.UINT64);
      case ValueType.INT8:
        return codec.read(DataType.INT8);
      case ValueType.INT16:
        return codec.read(DataType.INT16);
      case ValueType.INT32:
        return codec.read(DataType.INT32);
      case ValueType.INT64:
        return codec.read(DataType.INT64);
      case ValueType.FLOAT32:
        return codec.read(DataType.FLOAT32);
      case ValueType.FLOAT64:
        return codec.read(DataType.FLOAT64);
      case ValueType.STRING: {
        const length = codec.read(DataType.ULEB128);
        let value = '';
        for (let i = 0; i < length; i++) {
          const codePoint = codec.read(DataType.ULEB128);
          value += String.fromCodePoint(codePoint);
        }
        return value;
      }
      case ValueType.ARRAY: {
        const length = codec.read(DataType.ULEB128);
        const value: Value[] = [];
        for (let i = 0; i < length; i++) {
          value.push(read());
        }
        return value;
      }
      case ValueType.OBJECT: {
        const length = codec.read(DataType.ULEB128);
        const value: Record<string, Value> = {};
        for (let i = 0; i < length; i++) {
          const keyLength = codec.read(DataType.ULEB128);
          let key = '';
          for (let j = 0; j < keyLength; j++) {
            const codePoint = codec.read(DataType.ULEB128);
            key += String.fromCodePoint(codePoint);
          }
          value[key] = read();
        }
        return value;
      }
      default:
        return type;
    }
  };

  const reset = codec.reset;

  const write = (value: Value) => {
    switch (typeof value) {
      case 'bigint':
        if (value > 0xff_ff_ff_ff) {
          codecWrite(DataType.UINT8, ValueType.UINT64);
          codecWrite(DataType.UINT64, value);
        } else if (value < -0x80_00_00_00) {
          codecWrite(DataType.UINT8, ValueType.INT64);
          codecWrite(DataType.INT64, value);
        } else {
          writeSmallInt(Number(value));
        }
        break;
      case 'boolean':
        codecWrite(DataType.UINT8, value ? ValueType.TRUE : ValueType.FALSE);
        break;
      case 'number':
        if (Number.isInteger(value)) {
          if (value > 0xff_ff_ff_ff) {
            codecWrite(DataType.UINT8, ValueType.UINT64);
            codecWrite(DataType.UINT64, BigInt(value));
          } else if (value < -0x80_00_00_00) {
            codecWrite(DataType.UINT8, ValueType.INT64);
            codecWrite(DataType.INT64, BigInt(value));
          } else {
            writeSmallInt(value);
          }
        } else {
          float32Array[0] = value;
          const fitsFloat32 = float32Array[0] === value;
          if (fitsFloat32) {
            codecWrite(DataType.UINT8, ValueType.FLOAT32);
            codecWrite(DataType.FLOAT32, value);
          } else {
            codecWrite(DataType.UINT8, ValueType.FLOAT64);
            codecWrite(DataType.FLOAT64, value);
          }
        }
        break;
      case 'object':
        if (isArray(value)) {
          codecWrite(DataType.UINT8, ValueType.ARRAY);
          codecWrite(DataType.ULEB128, value.length);
          for (const element of value) {
            write(element);
          }
        } else if (value === null) {
          codecWrite(DataType.UINT8, ValueType.NULL);
        } else {
          codecWrite(DataType.UINT8, ValueType.OBJECT);
          codecWrite(DataType.ULEB128, Object.values(value).length);
          for (const key in value) {
            if (!has(value, key)) continue;
            codecWrite(DataType.ULEB128, key.length);
            for (const character of key) {
              codecWrite(DataType.ULEB128, character.codePointAt(0)!);
            }
            write(value[key]!);
          }
        }
        break;
      case 'string':
        codecWrite(DataType.UINT8, ValueType.STRING);
        codecWrite(DataType.ULEB128, value.length);
        for (const character of value) {
          codecWrite(DataType.ULEB128, character.codePointAt(0)!);
        }
        break;
      default:
        throw new TypeError(`Unsupported primitive type: ${typeof value}`);
    }
  };

  const writeSmallInt = (value: number) => {
    if (value >= 0) {
      if (value < ValueType.NULL) {
        codecWrite(DataType.UINT8, value);
      } else if (value <= 0xff) {
        codecWrite(DataType.UINT8, ValueType.UINT8);
        codecWrite(DataType.UINT8, value);
      } else if (value <= 0xff_ff) {
        codecWrite(DataType.UINT8, ValueType.UINT16);
        codecWrite(DataType.UINT16, value);
      } else {
        codecWrite(DataType.UINT8, ValueType.UINT32);
        codecWrite(DataType.UINT32, value);
      }
    } else if (value >= -0x80) {
      codecWrite(DataType.UINT8, ValueType.INT8);
      codecWrite(DataType.INT8, value);
    } else if (value >= -0x80_00) {
      codecWrite(DataType.UINT8, ValueType.INT16);
      codecWrite(DataType.INT16, value);
    } else {
      codecWrite(DataType.UINT8, ValueType.INT32);
      codecWrite(DataType.INT32, value);
    }
  };

  return { getOffset, read, reset, write };
};
