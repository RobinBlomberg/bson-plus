export type AnySchema = {
  type: 'any';
};

export type Schema = AnySchema;

export const any = (): AnySchema => ({
  type: 'any',
});
