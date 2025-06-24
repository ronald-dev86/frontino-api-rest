import { NotFoundException } from '@nestjs/common';

export class GasCylinderRefillNotFoundException extends NotFoundException {
  constructor(id: string) {
    super(`La recarga de cilindro con ID ${id} no fue encontrada`);
  }
} 