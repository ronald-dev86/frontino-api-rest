export class GasBillNotFoundException extends Error {
  constructor(id: string) {
    super(`Factura de gas con ID ${id} no encontrada`);
    this.name = 'GasBillNotFoundException';
  }
} 