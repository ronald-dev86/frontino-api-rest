import { BadRequestException } from '@nestjs/common';

export class InvalidGasCylinderRefillDataException extends BadRequestException {
  constructor(message: string) {
    super(`Datos de recarga de cilindro inválidos: ${message}`);
  }
} 