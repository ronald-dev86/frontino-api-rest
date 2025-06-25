import { Inject } from '@nestjs/common';
import { GasBillRepository } from '../ports/gas-bill.repository';
import { GasBill } from '../../domain/entities/gas-bill.entity';
import { UpdateGasBillDto } from '../dtos/update-gas-bill.dto';
import { GasBillNotFoundException } from '../../domain/exceptions/gas-bill-not-found.exception';
import { InvalidGasBillDataException } from '../../domain/exceptions/invalid-gas-bill-data.exception';
import { GAS_BILL_REPOSITORY } from '../../gas-bill.module';

export class UpdateGasBillUseCase {
  constructor(
    @Inject(GAS_BILL_REPOSITORY)
    private readonly gasBillRepository: GasBillRepository,
  ) {}

  async execute(id: string, updateGasBillDto: UpdateGasBillDto): Promise<GasBill> {
    const gasBill = await this.gasBillRepository.findById(id);
    
    if (!gasBill) {
      throw new GasBillNotFoundException(id);
    }
    
    try {
      return await this.gasBillRepository.update(id, updateGasBillDto);
    } catch (error) {
      throw new InvalidGasBillDataException(error.message);
    }
  }
} 