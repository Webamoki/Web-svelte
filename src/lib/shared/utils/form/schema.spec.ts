import { describe, expect, it } from 'vitest';

import { formEmail, formNumber, formText, nullable } from './schema.js';

describe('nullable', () => {
  const schema = nullable(formText);

  it('passes a real value through to the wrapped schema', () => {
    expect(schema.parse('hello')).toBe('hello');
  });

  it('maps an empty string (FormData empty field) to null', () => {
    expect(schema.parse('')).toBeNull();
    expect(schema.parse('   ')).toBeNull();
  });

  it('accepts a real JSON null (API body) and keeps it null', () => {
    // This is the transport-agnostic case: a JSON client sends literal null.
    expect(schema.parse(null)).toBeNull();
  });

  it('treats undefined (empty number field) as null', () => {
    expect(nullable(formNumber).parse(undefined)).toBeNull();
  });

  it('still validates the wrapped schema for non-empty values', () => {
    expect(() => nullable(formEmail).parse('not-an-email')).toThrow();
    expect(nullable(formEmail).parse('a@b.com')).toBe('a@b.com');
  });

  it('works with numeric fields', () => {
    expect(nullable(formNumber).parse(5)).toBe(5);
    expect(nullable(formNumber).parse(null)).toBeNull();
    expect(nullable(formNumber).parse('')).toBeNull();
  });
});
