import { Injectable } from '@nestjs/common';
import { GasCylinderRefill } from '../../domain/entities/gas-cylinder-refill.entity';
import { GasCylinderRefillRepository } from '../ports/gas-cylinder-refill.repository';
import { GasCylinderRefillNotFoundException } from '../../domain/exceptions/gas-cylinder-refill-not-found.exception';
import { UniqueId } from '../../../shared/domain/types';

@Injectable()
export class GetGasCylinderRefillByIdUseCase {
  constructor(
    private readonly gasCylinderRefillRepository: GasCylinderRefillRepository,
  ) {}

  async execute(id: UniqueId): Promise<GasCylinderRefill> {
    try {
      return await this.gasCylinderRefillRepository.findById(id);
    } catch (error) {
      throw new GasCylinderRefillNotFoundException(id);
    }
  }
} 