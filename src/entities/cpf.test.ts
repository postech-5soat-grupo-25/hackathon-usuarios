import { expect, test, describe, mock, beforeEach, } from "bun:test";
import { CpfSchema } from './cpf';

describe('CpfSchema', () => {
  test('should return true for valid CPFs', () => {
    expect(CpfSchema.safeParse('37543105853').success).toBe(true);
    expect(CpfSchema.safeParse('35093302007').success).toBe(true);
  });

  test('should return false for invalid CPFs', () => {
    expect(CpfSchema.safeParse('00000000001').success).toBe(false);
    expect(CpfSchema.safeParse('100').success).toBe(false);
    expect(CpfSchema.safeParse('12345678912').success).toBe(false);
  });
});