import { Inject } from '@nestjs/common';
import { GasBillRepository } from '../ports/gas-bill.repository';
import { GasBill } from '../../domain/entities/gas-bill.entity';
import { GasBillNotFoundException } from '../../domain/exceptions/gas-bill-not-found.exception';
import { GAS_BILL_REPOSITORY } from '../../gas-bill.module';

export class GetGasBillByIdUseCase {
  constructor(
    @Inject(GAS_BILL_REPOSITORY)
    private readonly gasBillRepository: GasBillRepository,
  ) {}

  async execute(id: string): Promise<GasBill> {
    const gasBill = await this.gasBillRepository.findById(id);
    
    if (!gasBill) {
      throw new GasBillNotFoundException(id);
    }
    
    return gasBill;
  }
} 