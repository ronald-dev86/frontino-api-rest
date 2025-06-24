import { Injectable } from '@nestjs/common';
import { Member } from '../../domain/entities/member.entity';
import { MemberRepository } from '../ports/member.repository';

@Injectable()
export class GetAllMembersByClientIdUseCase {
  constructor(
    private readonly memberRepository: MemberRepository
  ) {}

  async execute(clientId: string): Promise<Member[]> {
    return this.memberRepository.findAllByClientId(clientId);
  }
} 