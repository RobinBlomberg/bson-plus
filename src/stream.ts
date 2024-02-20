export type Processor<
  Input extends bigint | number,
  Output extends bigint | number = Input,
> = [() => Output, (value: Input) => void];

export type Processors = {
  bigint: Processor<bigint>;
  bigint64: Processor<bigint>;
  biguint: Processor<bigint>;
  biguint64: Processor<bigint>;
  decimal: Processor<bigint | number, number>;
  float32: Processor<number>;
  float64: Processor<number>;
  int: Processor<number>;
  int8: Processor<number>;
  int16: Processor<number>;
  int32: Processor<number>;
  uint: Processor<number>;
  uint8: Processor<number>;
  uint16: Processor<number>;
  uint32: Processor<number>;
};

export const createStream = (dataView: DataView, offset = 0) => {
  const intRangeError = new RangeError(
    "Value of type 'int' must be an integer from -2147483647 to 2147483647.",
  );
  const uintRangeError = new RangeError(
    "Value of type 'uint' must be an integer from 0 to 2147483647.",
  );

  const processors: Processors = {
    bigint: [
      () => {
        let byte = dataView.getUint8(offset++);
        const sign = byte & 0b0100_0000;
        let value = BigInt(byte & 0b0011_1111);
        let shift = 6n;
        while ((byte & 0b1000_0000) !== 0) {
          byte = dataView.getUint8(offset++);
          value |= BigInt(byte & 0b0111_1111) << shift;
          shift += 7n;
        }
        return sign === 0 ? value : -value;
      },
      (value) => {
        const sign = value < 0 ? 0b0100_0000 : 0;
        if (sign !== 0) value = -value;
        let byte = (Number(value) & 0b0011_1111) | sign;
        value >>= 6n;
        while (true) {
          if (value !== 0n) byte |= 0b1000_0000;
          dataView.setUint8(offset++, byte);
          if (value === 0n) return;
          byte = Number(value) & 0b0111_1111;
          value >>= 7n;
        }
      },
    ],
    bigint64: [
      () => {
        const value = dataView.getBigInt64(offset);
        offset += 8;
        return value;
      },
      (value) => {
        dataView.setBigInt64(offset, value);
        offset += 8;
      },
    ],
    biguint: [
      () => {
        let shift = 0n;
        let value = 0n;
        while (true) {
          const byte = dataView.getUint8(offset++);
          value |= BigInt(byte & 0b0111_1111) << shift;
          if ((byte & 0b1000_0000) === 0) return value;
          shift += 7n;
        }
      },
      (value) => {
        do {
          let byte = Number(value & 0b0111_1111n);
          value >>= 7n;
          if (value !== 0n) byte |= 0b1000_0000;
          dataView.setUint8(offset++, byte);
        } while (value !== 0n);
      },
    ],
    biguint64: [
      () => {
        const value = dataView.getBigUint64(offset);
        offset += 8;
        return value;
      },
      (value) => {
        dataView.setBigUint64(offset, value);
        offset += 8;
      },
    ],
    decimal: [
      () => {
        const byte = dataView.getUint8(offset++);
        const sign = byte & 0b1000_0000;
        const significandLength = byte & 0b0111_1111;
        const digits = read('biguint');
        let abs;
        if (significandLength === 0) {
          abs = Number(digits);
        } else {
          const string = String(digits);
          abs =
            +`${string.slice(0, -significandLength)}.${string.slice(-significandLength)}`;
        }
        return sign === 0 ? abs : -abs;
      },
      (value) => {
        const sign = (typeof value === 'bigint' ? value < 0n : value < 0)
          ? 0b1000_0000
          : 0;
        const string = String(sign === 0 ? value : -value);
        const stringLength = string.length;
        let digits = string;
        let significandLength = 0;
        for (let i = 1; i < stringLength; i++) {
          if (string[i] === '.') {
            significandLength = stringLength - i - 1;
            digits = `${string.slice(0, i)}${string.slice(i + 1)}`;
            break;
          }
        }
        dataView.setUint8(offset++, sign | (significandLength & 0b0111_1111));
        write('biguint', BigInt(digits));
      },
    ],
    float32: [
      () => {
        const value = dataView.getFloat32(offset);
        offset += 4;
        return value;
      },
      (value) => {
        dataView.setFloat32(offset, value);
        offset += 4;
      },
    ],
    float64: [
      () => {
        const value = dataView.getFloat64(offset);
        offset += 8;
        return value;
      },
      (value) => {
        dataView.setFloat64(offset, value);
        offset += 8;
      },
    ],
    int: [
      () => {
        let byte = dataView.getUint8(offset++);
        const sign = byte & 0b0100_0000;
        let value = byte & 0b0011_1111;
        let shift = 6;
        while ((byte & 0b1000_0000) !== 0) {
          byte = dataView.getUint8(offset++);
          value |= (byte & 0b0111_1111) << shift;
          shift += 7;
        }
        return sign === 0 ? value : -value;
      },
      (value) => {
        if (value <= -2_147_483_648 || value >= 2_147_483_648) {
          throw intRangeError;
        }
        const sign = value < 0 ? 0b0100_0000 : 0;
        if (sign !== 0) value = -value;
        let byte = (value & 0b0011_1111) | sign;
        value >>= 6;
        while (true) {
          if (value !== 0) byte |= 0b1000_0000;
          dataView.setUint8(offset++, byte);
          if (value === 0) return;
          byte = value & 0b0111_1111;
          value >>= 7;
        }
      },
    ],
    int8: [
      () => {
        return dataView.getInt8(offset++);
      },
      (value) => {
        dataView.setInt8(offset++, value);
      },
    ],
    int16: [
      () => {
        const value = dataView.getInt16(offset);
        offset += 2;
        return value;
      },
      (value) => {
        dataView.setInt16(offset, value);
        offset += 2;
      },
    ],
    int32: [
      () => {
        const value = dataView.getInt32(offset);
        offset += 4;
        return value;
      },
      (value) => {
        dataView.setInt32(offset, value);
        offset += 4;
      },
    ],
    uint: [
      () => {
        let shift = 0;
        let value = 0;
        while (true) {
          const byte = dataView.getUint8(offset++);
          value |= (byte & 0b0111_1111) << shift;
          if ((byte & 0b1000_0000) === 0) return value;
          shift += 7;
        }
      },
      (value) => {
        if (value >= 2_147_483_648) throw uintRangeError;
        do {
          let byte = value & 0b0111_1111;
          value >>= 7;
          if (value !== 0) byte |= 0b1000_0000;
          dataView.setUint8(offset++, byte);
        } while (value !== 0);
      },
    ],
    uint8: [
      () => {
        return dataView.getUint8(offset++);
      },
      (value) => {
        dataView.setUint8(offset++, value);
      },
    ],
    uint16: [
      () => {
        const value = dataView.getUint16(offset);
        offset += 2;
        return value;
      },
      (value) => {
        dataView.setUint16(offset, value);
        offset += 2;
      },
    ],
    uint32: [
      () => {
        const value = dataView.getUint32(offset);
        offset += 4;
        return value;
      },
      (value) => {
        dataView.setUint32(offset, value);
        offset += 4;
      },
    ],
  };

  const getOffset = () => {
    return offset;
  };

  const read = <Type extends keyof Processors>(type: Type) => {
    return processors[type][0]() as Parameters<Processors[Type][1]>[0];
  };

  const setOffset = (newOffset: number) => {
    offset = newOffset;
  };

  const write = <Type extends keyof Processors>(
    type: Type,
    value: Parameters<Processors[Type][1]>[0],
  ) => {
    return processors[type][1](value as never);
  };

  return { getOffset, read, setOffset, write };
};
