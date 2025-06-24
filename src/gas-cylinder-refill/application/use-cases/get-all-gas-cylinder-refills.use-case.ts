import { Injectable } from '@nestjs/common';
import { GasCylinderRefill } from '../../domain/entities/gas-cylinder-refill.entity';
import { GasCylinderRefillRepository } from '../ports/gas-cylinder-refill.repository';

@Injectable()
export class GetAllGasCylinderRefillsUseCase {
  constructor(
    private readonly gasCylinderRefillRepository: GasCylinderRefillRepository,
  ) {}

  async execute(): Promise<GasCylinderRefill[]> {
    return await this.gasCylinderRefillRepository.findAll();
  }
} 