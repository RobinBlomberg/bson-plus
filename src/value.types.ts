export type Value =
  | Value[]
  | bigint
  | boolean
  | null
  | number
  | { [Key in string]: Value }
  | string;
