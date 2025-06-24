export class Email {
  private static readonly EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  constructor(private readonly _value: string) {
    this.validate();
  }

  get value(): string {
    return this._value;
  }

  private validate(): void {
    if (!this._value || this._value.trim() === '') {
      throw new Error('Email no puede estar vacío');
    }

    if (!Email.EMAIL_REGEX.test(this._value)) {
      throw new Error('Email inválido');
    }
  }

  equals(email?: Email): boolean {
    if (!email) {
      return false;
    }
    return this._value === email.value;
  }
} 