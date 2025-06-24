export class InvalidClientDataException extends Error {
  constructor(message: string) {
    super(`Datos de cliente inválidos: ${message}`);
    this.name = 'InvalidClientDataException';
  }
} 