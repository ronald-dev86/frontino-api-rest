export class UniqueId {
  constructor(private readonly _value: string) {
    this.validate();
  }

  get value(): string {
    return this._value;
  }

  private validate(): void {
    if (!this._value || this._value.trim() === '') {
      throw new Error('ID no puede estar vacío');
    }
  }

  equals(id?: UniqueId): boolean {
    if (!id) {
      return false;
    }
    return this._value === id.value;
  }
} 