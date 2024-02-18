export type NumberSchema = {
  type?: 'float' | 'int' | 'int8' | 'uint' | 'uint8';
};

export type StringSchema = {
  isUnicode256?: boolean;
  length?: number;
};
