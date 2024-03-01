import {
  bigintvCodec,
  decimalCodec,
  uint8Codec,
  uintvCodec,
  type CodecIterator,
} from './codecs.js';
import type { Schema } from './schemas.js';

export const schemaCodec = {
  read(iterator: CodecIterator, schema: Schema) {
    const type = uint8Codec.read(iterator);
    switch (type) {
      case 0:
        return bigintvCodec.read(iterator);
      case 1:
        return false;
      case 2:
        return true;
      case 3:
        return decimalCodec.read(iterator);
      case 4: {
        const length = uintvCodec.read(iterator);
        const value = new TextDecoder().decode(
          new Uint8Array(iterator.dataView.buffer, iterator.offset, length),
        );
        iterator.offset += length;
        return value;
      }
      default:
        throw new TypeError(`Unsupported type: ${type}`);
    }
  },
  write(iterator: CodecIterator, schema: Schema, value: unknown) {
    const type = typeof value;
    switch (type) {
      case 'bigint':
        uint8Codec.write(iterator, 0);
        bigintvCodec.write(iterator, value as bigint);
        break;
      case 'boolean':
        uint8Codec.write(iterator, value ? 2 : 1);
        break;
      case 'number':
        uint8Codec.write(iterator, 3);
        decimalCodec.write(iterator, value as number);
        break;
      case 'string': {
        uint8Codec.write(iterator, 4);
        const bytes = new TextEncoder().encode(value as string);
        uintvCodec.write(iterator, bytes.length);
        const dataView = iterator.dataView;
        for (const byte of bytes) {
          dataView.setUint8(iterator.offset++, byte);
        }
        break;
      }
      default:
        throw new TypeError(`Unsupported type: ${type}`);
    }
  },
};
