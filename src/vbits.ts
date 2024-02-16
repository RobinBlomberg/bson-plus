import { writeVuint } from './vint.js';

export const writeVbits = (
  dataView: DataView,
  offset: number,
  value: boolean[],
) => {
  const length = value.length;
  offset = writeVuint(dataView, offset, length);
  let i = 0;
  while (i < length) {
    let byte = 0;
    let shift = 1;
    for (let j = 0; j < 8; j++) {
      if (value[i++] === true) byte |= shift;
      shift <<= 1;
    }
    dataView.setUint8(offset++, byte);
  }
};
