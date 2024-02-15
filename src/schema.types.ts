import type { NumberDataType } from './codec.types.js';
import type { SchemaType } from './schema.enums.js';

export type BooleanSchema = {
  type: SchemaType.BOOLEAN;
};

export type NumberSchema = {
  type: SchemaType.NUMBER;
  kind?: NumberDataType;
};

export type Primitive = boolean | number | string | null;

export type PrimitiveSchema<Value extends Primitive> = {
  type: SchemaType.PRIMITIVE;
  value: Value;
};

export type Schema = BooleanSchema | PrimitiveSchema<Primitive>;

export type SchemaValue<ThisSchema extends Schema> =
  ThisSchema extends BooleanSchema
    ? boolean
    : ThisSchema extends PrimitiveSchema<infer Value>
      ? Value
      : never;
