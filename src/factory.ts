import type { BooleanSchema, EnumSchema, StringSchema } from './schemas.js';
import { SchemaType } from './schemas.js';

export const schemaFactory = {
  boolean: (): BooleanSchema => {
    return {
      type: SchemaType.Boolean,
    };
  },
  enum: <Values>(values: Values[]): EnumSchema<Values> => {
    return {
      type: SchemaType.Enum,
      values,
    };
  },
  string: (options: { length?: number } = {}): StringSchema => {
    return {
      type: SchemaType.String,
      length: options.length,
    };
  },
};
