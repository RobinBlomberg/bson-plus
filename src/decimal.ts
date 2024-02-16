import { readSmallVsint, writeSmallVsint } from './vint.js';

export const readSmallDecimal = (dataView: DataView, offset: number) => {
  const significandLength = dataView.getUint8(offset++);
  const integer = readSmallVsint(dataView, offset);
  if (significandLength === 0) {
    return integer;
  }
  const string = String(integer);
  const significandIndex = string.length - significandLength;
  return +`${string.slice(0, significandIndex)}.${string.slice(significandIndex)}`;
};

export const writeSmallDecimal = (
  dataView: DataView,
  offset: number,
  value: number,
) => {
  const string = String(value);
  const stringLength = string.length;
  for (let i = 1; i < stringLength; i++) {
    if (string[i] === '.') {
      const significandLength = stringLength - i - 1;
      dataView.setUint8(offset++, significandLength);
      return writeSmallVsint(
        dataView,
        offset,
        +`${string.slice(0, i)}${string.slice(i + 1)}`,
      );
    }
  }
  dataView.setUint8(offset++, 0);
  return writeSmallVsint(dataView, offset, value);
};
