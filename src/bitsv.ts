import type { Iterator } from './iterator.js';

export const writeBitsv = (
  iterator: Iterator,
  elements: [length: number, value: number][],
) => {
  const dataView = iterator[0];
  const length = elements.length;
  let byte = 0;
  let element: [length: number, value: number] | undefined = elements[0];
  let i = 0;
  let shift = 0;

  while (element) {
    const valueLength = element[0];
    const value = element[1];
    byte |= (value << shift) & 0b111_1111;
    shift += valueLength;

    if (shift < 7) {
      element = elements[++i];
    } else if (shift === 7) {
      if (i !== length - 1) byte |= 0b1000_0000;
      dataView.setUint8(iterator[1]++, byte);
      byte = 0;
      element = elements[++i];
      shift = 0;
    } else {
      byte |= 0b1000_0000;
      dataView.setUint8(iterator[1]++, byte);
      byte = 0;
      const writtenLength = 7 - (shift - valueLength);
      const remainingLength = valueLength - writtenLength;
      element = [remainingLength, value >> writtenLength];
      shift = 0;
    }
  }

  if (shift > 0) {
    dataView.setUint8(iterator[1]++, byte);
  }
};
