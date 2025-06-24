export class MemberNotFoundException extends Error {
  constructor(id: string) {
    super(`Miembro con id ${id} no encontrado`);
    this.name = 'MemberNotFoundException';
  }
} 