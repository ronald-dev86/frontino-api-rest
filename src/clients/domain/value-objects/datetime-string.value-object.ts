export class DateTimeString {
  constructor(private readonly _value: string) {
    this.validate();
  }

  get value(): string {
    return this._value;
  }

  private validate(): void {
    if (!this._value || this._value.trim() === '') {
      throw new Error('Fecha y hora no pueden estar vacías');
    }
    
    // Comprueba si es una fecha ISO válida
    const date = new Date(this._value);
    if (isNaN(date.getTime())) {
      throw new Error('Formato de fecha y hora inválido');
    }
  }

  equals(dateTime?: DateTimeString): boolean {
    if (!dateTime) {
      return false;
    }
    return this._value === dateTime.value;
  }
} 