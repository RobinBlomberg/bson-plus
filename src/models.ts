export type ArraySchema = [type: DataType.ARRAY, elements: Schema];

export type PrimitiveType =
  | DataType.BOOLEAN
  | DataType.DOUBLE
  | DataType.INT16
  | DataType.INT32
  | DataType.INT8
  | DataType.STRING
  | DataType.UINT16
  | DataType.UINT32
  | DataType.UINT64
  | DataType.UINT8
  | DataType.VLQ;

export type BooleanSchema = [type: DataType.BOOLEAN];

export type Byte = number;

export type DoubleSchema = [type: DataType.DOUBLE];

export type EnumSchema = [
  type: DataType.ENUM,
  length: Vlq,
  members: Primitive[],
];

export type EnumTypedSchema = [
  type: DataType.ENUM_TYPED,
  length: Vlq,
  membersType: PrimitiveType,
  members: Primitive[],
];

export type Int8Schema = [type: DataType.INT8];

export type Int16Schema = [type: DataType.INT16];

export type Int32Schema = [type: DataType.INT32];

export type NullableSchema = [DataType.NULLABLE, schema: Schema];

export type ObjectSchema = [
  type: DataType.OBJECT,
  length: Vlq,
  properties: Property[],
];

export type ObjectPartialSchema = [
  type: DataType.OBJECT_PARTIAL,
  minLength: Vlq,
  properties: Property[],
];

export type Primitive = bigint | boolean | null | number | string;

export type Property = [key: string, value: Schema];

export type RecordSchema = [type: DataType.RECORD, values: Schema];

export type Schema =
  | ArraySchema
  | BooleanSchema
  | EnumSchema
  | EnumTypedSchema
  | DoubleSchema
  | Int16Schema
  | Int32Schema
  | Int8Schema
  | NullableSchema
  | ObjectPartialSchema
  | ObjectSchema
  | RecordSchema
  | StringSchema
  | TuplePartialSchema
  | TupleSchema
  | Uint16Schema
  | Uint32Schema
  | Uint64Schema
  | Uint8Schema
  | UnionSchema
  | UnknownSchema
  | VlqSchema;

export type StringSchema = [type: DataType.STRING];

export type TupleSchema = [
  type: DataType.TUPLE,
  length: Vlq,
  elements: Schema[],
];

export type TuplePartialSchema = [
  type: DataType.TUPLE_PARTIAL,
  minLength: Vlq,
  elements: Schema[],
];

export type Uint8Schema = [type: DataType.UINT8];

export type Uint16Schema = [type: DataType.UINT16];

export type Uint32Schema = [type: DataType.UINT32];

export type Uint64Schema = [type: DataType.UINT64];

export type UnionSchema = [
  type: DataType.UNION,
  length: Vlq,
  members: Schema[],
];

export type UnknownSchema = [type: DataType.UNKNOWN];

export type Vlq = number;

export type VlqSchema = [type: DataType.VLQ];

export const enum DataType {
  UNKNOWN,
  BOOLEAN,
  INT8,
  INT16,
  INT32,
  UINT8,
  UINT16,
  UINT32,
  UINT64,
  VLQ,
  DOUBLE,
  STRING,
  NULLABLE,
  ENUM,
  ENUM_TYPED,
  TUPLE,
  TUPLE_PARTIAL,
  ARRAY,
  OBJECT,
  OBJECT_PARTIAL,
  RECORD,
  UNION,
}

export const ArraySchema = (elements: Schema): ArraySchema => {
  return [DataType.ARRAY, elements];
};

export const BooleanSchema = (): BooleanSchema => {
  return [DataType.BOOLEAN];
};

export const DoubleSchema = (): DoubleSchema => {
  return [DataType.DOUBLE];
};

export const EnumSchema = (members: Primitive[]): EnumSchema => {
  return [DataType.ENUM, members.length, members];
};

export const EnumTypedSchema = (
  membersType: PrimitiveType,
  members: Primitive[],
): EnumTypedSchema => {
  return [DataType.ENUM_TYPED, members.length, membersType, members];
};

export const Int8Schema = (): Int8Schema => {
  return [DataType.INT8];
};

export const Int16Schema = (): Int16Schema => {
  return [DataType.INT16];
};

export const Int32Schema = (): Int32Schema => {
  return [DataType.INT32];
};

export const NullableSchema = (schema: Schema): NullableSchema => {
  return [DataType.NULLABLE, schema];
};

export const ObjectSchema = (properties: Property[]): ObjectSchema => {
  return [DataType.OBJECT, properties.length, properties];
};

export const ObjectPartialSchema = (
  properties: Property[],
): ObjectPartialSchema => {
  return [DataType.OBJECT_PARTIAL, properties.length, properties];
};

export const Property = (key: string, value: Schema): Property => {
  return [key, value];
};

export const RecordSchema = (values: Schema): RecordSchema => {
  return [DataType.RECORD, values];
};

export const StringSchema = (): StringSchema => {
  return [DataType.STRING];
};

export const TupleSchema = (elements: Schema[]): TupleSchema => {
  return [DataType.TUPLE, elements.length, elements];
};

export const TuplePartialSchema = (elements: Schema[]): TuplePartialSchema => {
  return [DataType.TUPLE_PARTIAL, elements.length, elements];
};

export const Uint8Schema = (): Uint8Schema => {
  return [DataType.UINT8];
};

export const Uint16Schema = (): Uint16Schema => {
  return [DataType.UINT16];
};

export const Uint32Schema = (): Uint32Schema => {
  return [DataType.UINT32];
};

export const Uint64Schema = (): Uint64Schema => {
  return [DataType.UINT64];
};

export const UnionSchema = (members: Schema[]): UnionSchema => {
  return [DataType.UNION, members.length, members];
};

export const UnknownSchema = (): Schema => {
  return [DataType.UNKNOWN];
};

export const VlqSchema = (): VlqSchema => {
  return [DataType.VLQ];
};
