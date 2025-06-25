export class InvalidGasBillDataException extends Error {
  constructor(message: string) {
    super(`Datos inválidos de factura de gas: ${message}`);
    this.name = 'InvalidGasBillDataException';
  }
} 