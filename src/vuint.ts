export const readBigVuint = (dataView: DataView, offset: number) => {
  let value = 0n;
  let shift = 0n;
  while (true) {
    const byte = dataView.getUint8(offset++);
    value |= BigInt(byte & 127) << shift;
    if ((byte & 128) === 0) {
      break;
    }
    shift += 7n;
  }
  return value;
};

export const readSmallVuint = (dataView: DataView, offset: number) => {
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
};

export const writeBigVuint = (
  dataView: DataView,
  offset: number,
  value: bigint,
) => {
  do {
    let byte = Number(value & 127n);
    value >>= 7n;
    if (value !== 0n) {
      byte |= 128;
    }
    dataView.setUint8(offset++, byte);
  } while (value !== 0n);
};

export const writeSmallVuint = (
  dataView: DataView,
  offset: number,
  value: number,
) => {
  do {
    let byte = value & 127;
    value >>= 7;
    if (value !== 0) {
      byte |= 128;
    }
    dataView.setUint8(offset++, byte);
  } while (value !== 0);
};

export const writeVuint = (
  dataView: DataView,
  offset: number,
  value: bigint | number,
) => {
  return value >= 2_147_483_648
    ? writeBigVuint(dataView, offset, BigInt(value))
    : writeSmallVuint(dataView, offset, Number(value));
};
