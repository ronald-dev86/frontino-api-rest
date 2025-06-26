// Este archivo configura el entorno de pruebas para Jest
import '@nestjs/testing';

// Para resolver errores de tipos en los archivos de prueba
declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace jest {
    interface Matchers<R> {
      toBeValidValue(): R;
      toEqual(expected: any): R;
      toHaveLength(expected: number): R;
      toBe(expected: any): R;
      toThrow(expected?: any): R;
      toBeDefined(): R;
    }
  }
  
  // Funciones globales de Jest
  function describe(name: string, fn: () => void): void;
  function beforeEach(fn: () => void): void;
  function beforeAll(fn: () => void): void;
  function afterEach(fn: () => void): void;
  function afterAll(fn: () => void): void;
  function it(name: string, fn: () => void | Promise<void>, timeout?: number): void;
  function expect<T>(actual: T): jest.Matchers<T>;
} 