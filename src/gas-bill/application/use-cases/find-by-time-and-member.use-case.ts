import { Inject } from '@nestjs/common';
import { GasBillRepository } from '../ports/gas-bill.repository';
import { GasBill } from '../../domain/entities/gas-bill.entity';
import { GAS_BILL_REPOSITORY } from '../../gas-bill.module';

export class FindByTimeAndMemberUseCase {
  constructor(
    @Inject(GAS_BILL_REPOSITORY)
    private readonly gasBillRepository: GasBillRepository,
  ) {}

  async execute(time: string, idMember: string): Promise<GasBill | null> {
    return await this.gasBillRepository.findByTimeAndMember(time, idMember);
  }
} 