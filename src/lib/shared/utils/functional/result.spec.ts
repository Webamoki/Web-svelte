import { describe, expect, it } from 'vitest';

import { Result } from './result.js';

describe('Result', () => {
  it('ok should create a successful result', () => {
    const res = Result.ok(42);
    expect(res).toEqual({ ok: true, value: 42 });
    expect(Result.isOk(res)).toBe(true);
    expect(Result.isErr(res)).toBe(false);
  });

  it('err should create a failed result', () => {
    const res = Result.err('error');
    expect(res).toEqual({ error: 'error', ok: false });
    expect(Result.isOk(res)).toBe(false);
    expect(Result.isErr(res)).toBe(true);
  });

  describe('unwrapOr', () => {
    it('should return value for ok', () => {
      expect(Result.unwrapOr(Result.ok(42), 0)).toBe(42);
    });

    it('should return default value for err', () => {
      expect(Result.unwrapOr(Result.err('error'), 0)).toBe(0);
    });
  });

  describe('unwrapOrElse', () => {
    it('should return value for ok', () => {
      expect(Result.unwrapOrElse(Result.ok(42), () => 0)).toBe(42);
    });

    it('should return computed value for err', () => {
      expect(Result.unwrapOrElse(Result.err('error'), (e) => e.length)).toBe(5);
    });
  });

  describe('map', () => {
    it('should transform ok value', () => {
      const res = Result.map(Result.ok(42), (v) => v * 2);
      expect(res).toEqual(Result.ok(84));
    });

    it('should not transform err value', () => {
      const res = Result.map(Result.err('error'), (v: number) => v * 2);
      expect(res).toEqual(Result.err('error'));
    });
  });

  describe('mapErr', () => {
    it('should transform err value', () => {
      const res = Result.mapErr(Result.err('error'), (e) => e.toUpperCase());
      expect(res).toEqual(Result.err('ERROR'));
    });

    it('should not transform ok value', () => {
      const res = Result.mapErr(Result.ok(42), (e: string) => e.toUpperCase());
      expect(res).toEqual(Result.ok(42));
    });
  });

  describe('andThen', () => {
    it('should chain ok values', () => {
      const res = Result.andThen(Result.ok(42), (v) => Result.ok(v * 2));
      expect(res).toEqual(Result.ok(84));
    });

    it('should return first err', () => {
      const res = Result.andThen(Result.err('error'), (v: number) => Result.ok(v * 2));
      expect(res).toEqual(Result.err('error'));
    });

    it('should return nested err', () => {
      const res = Result.andThen(Result.ok(42), () => Result.err('nested error'));
      expect(res).toEqual(Result.err('nested error'));
    });
  });

  describe('orElse', () => {
    it('should chain err values', () => {
      const res = Result.orElse(Result.err('error'), (e) => Result.err(e.toUpperCase()));
      expect(res).toEqual(Result.err('ERROR'));
    });

    it('should return first ok', () => {
      const res = Result.orElse(Result.ok(42), (e: string) => Result.err(e.toUpperCase()));
      expect(res).toEqual(Result.ok(42));
    });

    it('should return nested ok', () => {
      const res = Result.orElse(Result.err('error'), () => Result.ok(42));
      expect(res).toEqual(Result.ok(42));
    });
  });

  describe('match', () => {
    it('should call ok branch', () => {
      const res = Result.match(Result.ok(42), {
        err: () => 0,
        ok: (v) => v * 2
      });
      expect(res).toBe(84);
    });

    it('should call err branch', () => {
      const res = Result.match(Result.err('error'), {
        err: (e) => e.length,
        ok: (v: number) => v * 2
      });
      expect(res).toBe(5);
    });
  });
});
