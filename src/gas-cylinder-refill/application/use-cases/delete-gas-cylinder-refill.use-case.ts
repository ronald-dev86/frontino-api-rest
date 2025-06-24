import { Injectable } from '@nestjs/common';
import { GasCylinderRefillRepository } from '../ports/gas-cylinder-refill.repository';
import { GasCylinderRefillNotFoundException } from '../../domain/exceptions/gas-cylinder-refill-not-found.exception';
import { UniqueId } from '../../../shared/domain/types';

@Injectable()
export class DeleteGasCylinderRefillUseCase {
  constructor(
    private readonly gasCylinderRefillRepository: GasCylinderRefillRepository,
  ) {}

  async execute(id: UniqueId): Promise<void> {
    try {
      // Verificar que la recarga existe
      await this.gasCylinderRefillRepository.findById(id);
      
      await this.gasCylinderRefillRepository.delete(id);
    } catch (error) {
      throw new GasCylinderRefillNotFoundException(id);
    }
  }
} 