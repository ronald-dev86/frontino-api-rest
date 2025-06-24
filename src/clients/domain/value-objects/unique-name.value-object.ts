export class UniqueName {
  constructor(private readonly _value: string) {
    this.validate();
  }

  get value(): string {
    return this._value;
  }

  private validate(): void {
    if (!this._value || this._value.trim() === '') {
      throw new Error('Nombre no puede estar vacío');
    }
    
    if (this._value.trim().length < 3) {
      throw new Error('Nombre debe tener al menos 3 caracteres');
    }
  }

  equals(name?: UniqueName): boolean {
    if (!name) {
      return false;
    }
    return this._value === name.value;
  }
} 