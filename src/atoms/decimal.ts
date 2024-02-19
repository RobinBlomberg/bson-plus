import type { Iterator } from './iterator.js';
import { readBigUint, writeBigUint } from './uint.js';

export const readDecimal = (iterator: Iterator) => {
  const byte = iterator[0].getUint8(iterator[1]++);
  const sign = byte & 0b1000_0000;
  const significandLength = byte & 0b0111_1111;

  // Read the integer representation of the value:
  const integer = readBigUint(iterator);

  // Convert the integer representation to a floating-point number:
  let absoluteValue;
  if (significandLength === 0) {
    absoluteValue = Number(integer);
  } else {
    const string = String(integer);
    absoluteValue =
      +`${string.slice(0, -significandLength)}.${string.slice(-significandLength)}`;
  }

  // Apply the sign:
  return sign === 0 ? absoluteValue : -absoluteValue;
};

export const writeDecimal = (iterator: Iterator, value: number) => {
  const sign = value < 0 ? 0b1000_0000 : 0;

  // Remove the sign:
  if (sign !== 0) value = -value;

  const string = String(value);
  const stringLength = string.length;
  let concatenatedInteger: string;
  let significandLength = 0;

  for (let i = 1; i < stringLength; i++) {
    if (string[i] === '.') {
      significandLength = stringLength - i - 1;
      concatenatedInteger = `${string.slice(0, i)}${string.slice(i + 1)}`;
      break;
    }
  }

  // Write the sign bit and the length of the significand (up to 127 digits):
  iterator[0].setUint8(iterator[1]++, sign | (significandLength & 0b0111_1111));

  // Write the value represented as an integer:
  writeBigUint(iterator, BigInt(concatenatedInteger! ?? string));
};
