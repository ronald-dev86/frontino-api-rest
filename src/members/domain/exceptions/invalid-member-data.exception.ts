export class InvalidMemberDataException extends Error {
  constructor(message: string) {
    super(`Datos inválidos del miembro: ${message}`);
    this.name = 'InvalidMemberDataException';
  }
} 