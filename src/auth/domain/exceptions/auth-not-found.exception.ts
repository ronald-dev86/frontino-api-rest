export class AuthNotFoundException extends Error {
  constructor(id: string) {
    super(`Autenticación con ID ${id} no encontrada`);
    this.name = 'AuthNotFoundException';
  }
} 