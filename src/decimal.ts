import type { Iterator } from './iterator.js';
import {
  readBigUintv,
  readSmallUintv,
  writeBigUintv,
  writeSmallUintv,
} from './uintv.js';

export const readDecimal = (iterator: Iterator) => {
  const significandLength = readSmallUintv(iterator);
  const integer = readBigUintv(iterator);
  if (significandLength === 0) return Number(integer);
  const string = String(integer);
  return +`${string.slice(0, -significandLength)}.${string.slice(-significandLength)}`;
};

export const writeDecimal = (iterator: Iterator, value: number) => {
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

  writeSmallUintv(iterator, significandLength);
  writeBigUintv(iterator, BigInt(concatenatedInteger! ?? string));
};
