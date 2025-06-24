import { Injectable } from '@nestjs/common';
import { GasCylinderRefill } from '../../domain/entities/gas-cylinder-refill.entity';
import { GasCylinderRefillRepository } from '../ports/gas-cylinder-refill.repository';
import { UniqueId } from '../../../shared/domain/types';

@Injectable()
export class GetGasCylinderRefillsByCylinderIdUseCase {
  constructor(
    private readonly gasCylinderRefillRepository: GasCylinderRefillRepository,
  ) {}

  async execute(gasCylinderId: UniqueId): Promise<GasCylinderRefill[]> {
    return await this.gasCylinderRefillRepository.findByGasCylinderId(gasCylinderId);
  }
} 