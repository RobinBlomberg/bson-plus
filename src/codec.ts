import { DataType } from './enums.js';
import type { DataValueOfType, DataValuesOfTypes } from './types.js';

export const createCodec = (dataView: DataView) => {
  let offset = 0;

  const codec = {
    read: <Type extends DataType>(type: Type) => {
      switch (type) {
        case DataType.FLOAT32: {
          const value = dataView.getFloat32(offset, true);
          offset += 4;
          return value;
        }
        case DataType.FLOAT64: {
          const value = dataView.getFloat64(offset, true);
          offset += 8;
          return value;
        }
        case DataType.INT8:
          return dataView.getInt8(offset++);
        case DataType.INT16: {
          const value = dataView.getInt16(offset, true);
          offset += 2;
          return value;
        }
        case DataType.INT32: {
          const value = dataView.getInt32(offset, true);
          offset += 4;
          return value;
        }
        case DataType.INT64: {
          const value = dataView.getBigInt64(offset, true);
          offset += 8;
          return value;
        }
        case DataType.LEB128: {
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
          return value;
        }
        case DataType.UINT8:
          return dataView.getUint8(offset++);
        case DataType.UINT16: {
          const value = dataView.getUint16(offset, true);
          offset += 2;
          return value;
        }
        case DataType.UINT32: {
          const value = dataView.getUint32(offset, true);
          offset += 4;
          return value;
        }
        case DataType.UINT64: {
          const value = dataView.getBigUint64(offset, true);
          offset += 8;
          return value;
        }
        default:
          throw new RangeError(`Unknown type: ${type}`);
      }
    },
    readMany: <const Types extends DataType[]>(types: Types) => {
      const values = [] as DataValuesOfTypes<Types>;
      for (const type of types) {
        values.push(codec.read(type) as never);
      }
      return values;
    },
    reset: () => {
      offset = 0;
    },
    write: <Type extends DataType>(
      type: Type,
      value: DataValueOfType<Type>,
    ) => {
      switch (type) {
        case DataType.FLOAT32:
          dataView.setFloat32(offset, value as number, true);
          offset += 4;
          break;
        case DataType.FLOAT64:
          dataView.setFloat64(offset, value as number, true);
          offset += 8;
          break;
        case DataType.INT8:
          dataView.setInt8(offset++, value as number);
          break;
        case DataType.INT16:
          dataView.setInt16(offset, value as number, true);
          offset += 2;
          break;
        case DataType.INT32:
          dataView.setInt32(offset, value as number, true);
          offset += 4;
          break;
        case DataType.INT64:
          dataView.setBigInt64(offset, value as bigint, true);
          offset += 8;
          break;
        case DataType.LEB128: {
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
          dataView.setUint16(offset, value as number, true);
          offset += 2;
          break;
        case DataType.UINT32:
          dataView.setUint32(offset, value as number, true);
          offset += 4;
          break;
        case DataType.UINT64:
          dataView.setBigUint64(offset, value as bigint, true);
          offset += 8;
          break;
        default:
          throw new RangeError(`Unknown type: ${type}`);
      }
    },
    writeMany: <const Types extends DataType[]>(
      types: Types,
      values: DataValuesOfTypes<Types>,
    ) => {
      for (let i = 0; i < types.length; i++) {
        codec.write(types[i]!, values[i]!);
      }
    },
  };

  return codec;
};
