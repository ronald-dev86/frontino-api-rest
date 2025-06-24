import { Injectable } from '@nestjs/common';
import { GasCylinderRefill } from '../../domain/entities/gas-cylinder-refill.entity';
import { UpdateGasCylinderRefillDto } from '../dtos/update-gas-cylinder-refill.dto';
import { GasCylinderRefillRepository } from '../ports/gas-cylinder-refill.repository';
import { GasCylinderRefillNotFoundException } from '../../domain/exceptions/gas-cylinder-refill-not-found.exception';
import { InvalidGasCylinderRefillDataException } from '../../domain/exceptions/invalid-gas-cylinder-refill-data.exception';
import { UniqueId } from '../../../shared/domain/types';

@Injectable()
export class UpdateGasCylinderRefillUseCase {
  constructor(
    private readonly gasCylinderRefillRepository: GasCylinderRefillRepository,
  ) {}

  async execute(id: UniqueId, updateGasCylinderRefillDto: UpdateGasCylinderRefillDto): Promise<GasCylinderRefill> {
    try {
      // Verificar que la recarga existe
      await this.gasCylinderRefillRepository.findById(id);
      
      // Crear un objeto con los campos a actualizar
      const updateData: Partial<GasCylinderRefill> = {};
      
      if (updateGasCylinderRefillDto.fillingPercentage !== undefined) {
        updateData['fillingPercentage'] = updateGasCylinderRefillDto.fillingPercentage;
      }
      
      if (updateGasCylinderRefillDto.fillingTime !== undefined) {
        updateData['fillingTime'] = updateGasCylinderRefillDto.fillingTime;
      }
      
      if (updateGasCylinderRefillDto.urlVoucher !== undefined) {
        updateData['urlVoucher'] = updateGasCylinderRefillDto.urlVoucher;
      }
      
      return await this.gasCylinderRefillRepository.update(id, updateData);
    } catch (error) {
      if (error instanceof GasCylinderRefillNotFoundException) {
        throw error;
      }
      throw new InvalidGasCylinderRefillDataException(error.message);
    }
  }
} 