export class ClientNotFoundException extends Error {
  constructor(id: string) {
    super(`Cliente con id ${id} no encontrado`);
    this.name = 'ClientNotFoundException';
  }
} 