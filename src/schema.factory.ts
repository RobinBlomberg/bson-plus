import { SchemaType } from './schema.enums.js';
import type { Primitive, PrimitiveSchema } from './schema.types.js';

export const schemaFactory = {
  primitive: <Value extends Primitive>(
    value: Value,
  ): PrimitiveSchema<Value> => {
    return {
      type: SchemaType.PRIMITIVE,
      value,
    };
  },
};
