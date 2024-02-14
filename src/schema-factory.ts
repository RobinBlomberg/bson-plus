import type {
  ArraySchema,
  BooleanSchema,
  EnumSchema,
  Schema,
  StringSchema,
} from './schemas.js';
import { SchemaType } from './schemas.js';

export const schemaFactory = {
  array: <Elements extends Schema>(
    options: { elements?: Elements; length?: number } = {},
  ): ArraySchema<Elements> => {
    return {
      type: SchemaType.Array,
      length: options.length,
      elements: options.elements,
    };
  },
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
