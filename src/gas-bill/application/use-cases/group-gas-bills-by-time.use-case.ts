import { GasBillRepository } from '../ports/gas-bill.repository';
import { MemberRepository } from '../../../members/application/ports/member.repository';
import { GroupedGasBillsDto } from '../dtos/grouped-gas-bills.dto';
import { Injectable } from '@nestjs/common';
import { DateTimeString } from '../../../shared/domain/types';
import { GasBill } from '../../domain/entities/gas-bill.entity';

@Injectable()
export class GroupGasBillsByTimeUseCase {
  constructor(
    private readonly gasBillRepository: GasBillRepository,
    private readonly memberRepository: MemberRepository
  ) {}

  async execute(clientId: string): Promise<GroupedGasBillsDto[]> {
    const membersByClient = await this.memberRepository.findAllByClientId(clientId);
    const memberIds = membersByClient.map(member => member.id);

    const allGasBills = await this.gasBillRepository.findInIdsMembers(memberIds);

    const groupedBillsMap: { [key: string]: GasBill[] } = {};

    for (const bill of allGasBills) {
      const time = bill.time;
      if (typeof time === 'string' && time.trim() !== '') {
        if (!groupedBillsMap[time]) {
          groupedBillsMap[time] = [];
        }
        groupedBillsMap[time].push(bill);
      }
    }

    const groupedBillsArray: GroupedGasBillsDto[] = Object.keys(groupedBillsMap).map(time => ({
      time: time as DateTimeString,
      bills: groupedBillsMap[time],
    }));

    return groupedBillsArray;
  }
}
