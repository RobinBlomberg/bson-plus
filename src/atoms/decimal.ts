import type { Iterator } from './iterator.js';
import { readBigUint, writeBigUint } from './uint.js';

export const readDecimal = (iterator: Iterator) => {
  // Read the sign and the length of the significand:
  const byte = iterator[0].getUint8(iterator[1]++);
  const sign = byte & 0b1000_0000;
  const significandLength = byte & 0b0111_1111;

  // Read the integer representation of the value:
  const integer = readBigUint(iterator);

  // Convert the integer representation to a floating-point number value:
  let absoluteValue;
  if (significandLength === 0) {
    absoluteValue = Number(integer);
  } else {
    const string = String(integer);
    absoluteValue =
      +`${string.slice(0, -significandLength)}.${string.slice(-significandLength)}`;
  }

  // Apply the sign to the value:
  return sign === 0 ? absoluteValue : -absoluteValue;
};

export const writeDecimal = (iterator: Iterator, value: number) => {
  // Get the sign bit:
  const sign = value < 0 ? 0b1000_0000 : 0;

  // Remove the sign from the value:
  if (sign !== 0) value = -value;

  const string = String(value);
  const stringLength = string.length;
  let concatenatedInteger: string;
  let significandLength = 0;

  // Find the decimal point:
  for (let i = 1; i < stringLength; i++) {
    if (string[i] === '.') {
      // Get the length of the significand:
      significandLength = stringLength - i - 1;

      // Remove the decimal point from the value:
      concatenatedInteger = `${string.slice(0, i)}${string.slice(i + 1)}`;
      break;
    }
  }

  // Write the sign bit and the length of the significand (up to 127 digits):
  iterator[0].setUint8(iterator[1]++, sign | (significandLength & 0b0111_1111));

  // Write the value represented as an integer:
  writeBigUint(iterator, BigInt(concatenatedInteger! ?? string));
};
