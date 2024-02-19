export type NumberSchema = {
  type: 'Decimal' | 'Float64' | 'Int' | 'Int8' | 'Uint' | 'Uint8';
};

export type Schema = NumberSchema | StringSchema;

export type StringSchema = {
  type: 'String' | 'String256';
  length?: number;
};
