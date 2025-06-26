export class UserNotFoundException extends Error {
  constructor(id: string) {
    super(`Usuario con id ${id} no encontrado`);
    this.name = 'UserNotFoundException';
  }
} 