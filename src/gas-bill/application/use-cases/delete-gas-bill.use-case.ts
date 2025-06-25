import { Inject } from '@nestjs/common';
import { GasBillRepository } from '../ports/gas-bill.repository';
import { GasBillNotFoundException } from '../../domain/exceptions/gas-bill-not-found.exception';
import { GAS_BILL_REPOSITORY } from '../../gas-bill.module';

export class DeleteGasBillUseCase {
  constructor(
    @Inject(GAS_BILL_REPOSITORY)
    private readonly gasBillRepository: GasBillRepository,
  ) {}

  async execute(id: string): Promise<void> {
    const gasBill = await this.gasBillRepository.findById(id);
    
    if (!gasBill) {
      throw new GasBillNotFoundException(id);
    }
    
    await this.gasBillRepository.delete(id);
  }
} 