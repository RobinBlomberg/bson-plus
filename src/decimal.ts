import { readVuint, writeVuint } from './vint.js';

export const readDecimal = (dataView: DataView, offset: number) => {
  const byte = dataView.getUint8(offset++);
  const sign = byte & 128;
  const significandLength = byte & 127;
  let value = Number(readVuint(dataView, offset));

  if (significandLength !== 0) {
    const string = String(value);
    value =
      +`${string.slice(0, -significandLength)}.${string.slice(-significandLength)}`;
  }

  return sign === 0 ? value : -value;
};

export const writeDecimal = (
  dataView: DataView,
  offset: number,
  value: bigint | number,
) => {
  const sign = Object.is(value, -0) || value < 0 ? 128 : 0;
  if (sign !== 0) value = -value;
  const string = String(value);
  const stringLength = string.length;
  let significandLength = 0;

  for (let i = 1; i < stringLength; i++) {
    if (string[i] === '.') {
      significandLength = stringLength - i - 1;
      value = BigInt(`${string.slice(0, i)}${string.slice(i + 1)}`);
      break;
    }
  }

  dataView.setUint8(offset++, sign | significandLength);
  return writeVuint(dataView, offset, value);
};
