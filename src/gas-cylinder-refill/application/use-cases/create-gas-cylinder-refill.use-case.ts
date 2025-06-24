import { Injectable } from '@nestjs/common';
import { GasCylinderRefill } from '../../domain/entities/gas-cylinder-refill.entity';
import { CreateGasCylinderRefillDto } from '../dtos/create-gas-cylinder-refill.dto';
import { GasCylinderRefillRepository } from '../ports/gas-cylinder-refill.repository';
import { InvalidGasCylinderRefillDataException } from '../../domain/exceptions/invalid-gas-cylinder-refill-data.exception';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class CreateGasCylinderRefillUseCase {
  constructor(
    private readonly gasCylinderRefillRepository: GasCylinderRefillRepository,
  ) {}

  async execute(createGasCylinderRefillDto: CreateGasCylinderRefillDto): Promise<GasCylinderRefill> {
    try {
      const now = new Date().toISOString();
      
      const gasCylinderRefill = new GasCylinderRefill(
        uuidv4(),
        createGasCylinderRefillDto.idGasCylinder,
        createGasCylinderRefillDto.fillingPercentage,
        createGasCylinderRefillDto.fillingTime,
        createGasCylinderRefillDto.urlVoucher,
        now,
        now,
      );

      return await this.gasCylinderRefillRepository.create(gasCylinderRefill);
    } catch (error) {
      throw new InvalidGasCylinderRefillDataException(error.message);
    }
  }
} 