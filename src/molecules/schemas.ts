export type NumberSchema = {
  type: 'float' | 'int' | 'int8' | 'number' | 'uint' | 'uint8';
};

export type Schema = NumberSchema | StringSchema;

export type StringSchema = {
  type: 'string' | 'string256';
  length?: number;
};
