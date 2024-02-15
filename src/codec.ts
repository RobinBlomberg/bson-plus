import { DataType } from './codec.enums.js';
import type {
  Codec,
  DataValueInput,
  DataValueInputs,
  DataValueOutputs,
} from './codec.types.js';

export const createCodec = (dataView: DataView) => {
  let offset = 0;

  const codec: Codec = {
    getOffset: () => {
      return offset;
    },
    read: <Type extends DataType>(type: Type) => {
      switch (type) {
        case DataType.FLOAT32: {
          const value = dataView.getFloat32(offset);
          offset += 4;
          return value as DataValueInput<Type>;
        }
        case DataType.FLOAT64: {
          const value = dataView.getFloat64(offset);
          offset += 8;
          return value as DataValueInput<Type>;
        }
        case DataType.INT8: {
          const value = dataView.getInt8(offset++);
          return value as DataValueInput<Type>;
        }
        case DataType.INT16: {
          const value = dataView.getInt16(offset);
          offset += 2;
          return value as DataValueInput<Type>;
        }
        case DataType.INT32: {
          const value = dataView.getInt32(offset);
          offset += 4;
          return value as DataValueInput<Type>;
        }
        case DataType.INT64: {
          const value = dataView.getBigInt64(offset);
          offset += 8;
          return value as DataValueInput<Type>;
        }
        case DataType.ULEB128: {
          let value = 0;
          let shift = 0;
          while (true) {
            const byte = dataView.getUint8(offset++);
            value |= (byte & 127) << shift;
            if ((byte & 128) === 0) {
              break;
            }
            shift += 7;
          }
          return value as DataValueInput<Type>;
        }
        case DataType.UINT8: {
          const value = dataView.getUint8(offset++);
          return value as DataValueInput<Type>;
        }
        case DataType.UINT16: {
          const value = dataView.getUint16(offset);
          offset += 2;
          return value as DataValueInput<Type>;
        }
        case DataType.UINT32: {
          const value = dataView.getUint32(offset);
          offset += 4;
          return value as DataValueInput<Type>;
        }
        case DataType.UINT64: {
          const value = dataView.getBigUint64(offset);
          offset += 8;
          return value as DataValueInput<Type>;
        }
        default:
          throw new RangeError(`Unknown type: ${type}`);
      }
    },
    readMany: <const Types extends readonly DataType[]>(types: Types) => {
      const values = [] as DataValueInputs<Types>;
      for (const type of types) {
        values.push(codec.read(type) as never);
      }
      return values;
    },
    reset: () => {
      offset = 0;
    },
    write: <Type extends DataType>(type: Type, value: DataValueInput<Type>) => {
      switch (type) {
        case DataType.FLOAT32:
          dataView.setFloat32(offset, value as number);
          offset += 4;
          break;
        case DataType.FLOAT64:
          dataView.setFloat64(offset, value as number);
          offset += 8;
          break;
        case DataType.INT8:
          dataView.setInt8(offset++, value as number);
          break;
        case DataType.INT16:
          dataView.setInt16(offset, value as number);
          offset += 2;
          break;
        case DataType.INT32:
          dataView.setInt32(offset, value as number);
          offset += 4;
          break;
        case DataType.INT64:
          dataView.setBigInt64(offset, value as bigint);
          offset += 8;
          break;
        case DataType.ULEB128: {
          (value as number) |= 0;
          do {
            let byte = value & 127;
            (value as number) >>= 7;
            if (value !== 0) {
              byte |= 128;
            }
            dataView.setUint8(offset++, byte);
          } while (value !== 0);
          break;
        }
        case DataType.UINT8:
          dataView.setUint8(offset++, value as number);
          break;
        case DataType.UINT16:
          dataView.setUint16(offset, value as number);
          offset += 2;
          break;
        case DataType.UINT32:
          dataView.setUint32(offset, value as number);
          offset += 4;
          break;
        case DataType.UINT64:
          dataView.setBigUint64(offset, value as bigint);
          offset += 8;
          break;
        default:
          throw new RangeError(`Unknown type: ${type}`);
      }
    },
    writeMany: <const Types extends DataType[] | readonly DataType[]>(
      types: Types,
      values: DataValueOutputs<Types>,
    ) => {
      for (let i = 0; i < types.length; i++) {
        codec.write(types[i]!, values[i]!);
      }
    },
  };

  return codec;
};
