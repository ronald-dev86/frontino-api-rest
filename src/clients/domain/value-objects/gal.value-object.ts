export class Gal {
  constructor(private readonly _value: number) {
    this.validate();
  }

  get value(): number {
    return this._value;
  }

  private validate(): void {
    if (this._value === undefined || this._value === null) {
      throw new Error('El valor de galones no puede estar vacío');
    }

    if (isNaN(this._value) || this._value < 0) {
      throw new Error('El valor de galones debe ser un número positivo');
    }
  }

  equals(gal?: Gal): boolean {
    if (!gal) {
      return false;
    }
    return this._value === gal.value;
  }
} 