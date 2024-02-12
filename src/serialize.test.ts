import {
  ArraySchema,
  DoubleSchema,
  ObjectSchema,
  StringSchema,
  Uint8Schema,
} from './models.js';
import { serialize } from './serialize.js';

const schema = ObjectSchema([
  ['productId', Uint8Schema()],
  ['productName', StringSchema()],
  ['price', DoubleSchema()],
  ['tags', ArraySchema(StringSchema())],
]).flat(4) as (number | string)[];

const value = {
  productId: 1,
  productName: 'A green door',
  price: 12.5,
  tags: ['home', 'green'],
};

console.log(serialize(schema, value));
