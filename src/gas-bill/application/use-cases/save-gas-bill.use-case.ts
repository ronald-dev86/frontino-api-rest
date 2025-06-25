import { Inject } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { GasBillRepository } from '../ports/gas-bill.repository';
import { CreateGasBillDto } from '../dtos/create-gas-bill.dto';
import { GasBill } from '../../domain/entities/gas-bill.entity';
import { InvalidGasBillDataException } from '../../domain/exceptions/invalid-gas-bill-data.exception';
import { GAS_BILL_REPOSITORY } from '../../gas-bill.module';

export class SaveGasBillUseCase {
  constructor(
    @Inject(GAS_BILL_REPOSITORY)
    private readonly gasBillRepository: GasBillRepository,
  ) {}

  async execute(createGasBillDto: CreateGasBillDto): Promise<GasBill> {
    try {
      const now = new Date().toISOString();
      const gasBill = new GasBill(
        uuidv4(),
        createGasBillDto.idMember,
        createGasBillDto.time,
        createGasBillDto.m3,
        createGasBillDto.urlPhoto,
        now,
        now,
      );

      return await this.gasBillRepository.save(gasBill);
    } catch (error) {
      throw new InvalidGasBillDataException(error.message);
    }
  }
} 