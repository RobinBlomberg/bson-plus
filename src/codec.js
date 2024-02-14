/**
 * @param {DataView} dataView
 */
export const createCodec = (dataView) => {
  let offset = 0;
  return {
    /**
     * @param {Type} type
     */
    read: (type) => {
      switch (type) {
        case /* FLOAT32 */ 0: {
          const value = dataView.getFloat32(offset, true);
          offset += 4;
          return value;
        }
        case /* FLOAT64 */ 1: {
          const value = dataView.getFloat64(offset, true);
          offset += 8;
          return value;
        }
        case /* INT8 */ 2:
          return dataView.getInt8(offset++);
        case /* INT16 */ 3: {
          const value = dataView.getInt16(offset, true);
          offset += 2;
          return value;
        }
        case /* INT32 */ 4: {
          const value = dataView.getInt32(offset, true);
          offset += 4;
          return value;
        }
        case /* INT64 */ 5: {
          const value = dataView.getBigInt64(offset, true);
          offset += 8;
          return value;
        }
        case /* LEB128 */ 6: {
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
        case /* UINT8 */ 7:
          return dataView.getUint8(offset++);
        case /* UINT16 */ 8: {
          const value = dataView.getUint16(offset, true);
          offset += 2;
          return value;
        }
        case /* UINT32 */ 9: {
          const value = dataView.getUint32(offset, true);
          offset += 4;
          return value;
        }
        case /* UINT64 */ 10: {
          const value = dataView.getBigUint64(offset, true);
          offset += 8;
          return value;
        }
        default:
          throw new RangeError(`Unknown type: ${type}`);
      }
    },
    reset: () => {
      offset = 0;
    },
    /**
     * @template {Type} T
     * @param {T} type
     * @param {T extends Type.INT64 | Type.UINT64 ? bigint : number} value
     */
    write: (type, value) => {
      switch (type) {
        case /* FLOAT32 */ 0:
          dataView.setFloat32(offset, /** @type {number} */ (value), true);
          offset += 4;
          break;
        case /* FLOAT64 */ 1:
          dataView.setFloat64(offset, /** @type {number} */ (value), true);
          offset += 8;
          break;
        case /* INT8 */ 2:
          dataView.setInt8(offset++, /** @type {number} */ (value));
          break;
        case /* INT16 */ 3:
          dataView.setInt16(offset, /** @type {number} */ (value), true);
          offset += 2;
          break;
        case /* INT32 */ 4:
          dataView.setInt32(offset, /** @type {number} */ (value), true);
          offset += 4;
          break;
        case /* INT64 */ 5:
          dataView.setBigInt64(offset, /** @type {bigint} */ (value), true);
          offset += 8;
          break;
        case /* LEB128 */ 6: {
          /** @type {number} */ (value) |= 0;
          do {
            let byte = value & 127;
            /** @type {number} */ (value) >>= 7;
            if (value !== 0) {
              byte |= 128;
            }
            dataView.setUint8(offset++, byte);
          } while (value !== 0);
          break;
        }
        case /* UINT8 */ 7:
          dataView.setUint8(offset++, /** @type {number} */ (value));
          break;
        case /* UINT16 */ 8:
          dataView.setUint16(offset, /** @type {number} */ (value), true);
          offset += 2;
          break;
        case /* UINT32 */ 9:
          dataView.setUint32(offset, /** @type {number} */ (value), true);
          offset += 4;
          break;
        case /* UINT64 */ 10:
          dataView.setBigUint64(offset, /** @type {bigint} */ (value), true);
          offset += 8;
          break;
        default:
          throw new RangeError(`Unknown type: ${type}`);
      }
    },
  };
};
