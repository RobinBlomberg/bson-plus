export const countDecimals = (value: number) => {
  const string = String(value);
  const decimalSeparatorIndex = string.indexOf('.');
  return decimalSeparatorIndex === -1
    ? 0
    : +string.slice(decimalSeparatorIndex + 1);
};
