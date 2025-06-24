import { Injectable } from '@nestjs/common';
import { Member } from '../../domain/entities/member.entity';
import { MemberRepository } from '../ports/member.repository';

@Injectable()
export class GetAllMembersUseCase {
  constructor(
    private readonly memberRepository: MemberRepository
  ) {}

  async execute(): Promise<Member[]> {
    return this.memberRepository.findAll();
  }
} 