import { Injectable } from '@nestjs/common';
import { Member } from '../../domain/entities/member.entity';
import { MemberRepository } from '../ports/member.repository';
import { MemberNotFoundException } from '../../domain/exceptions/member-not-found.exception';

@Injectable()
export class GetMemberByIdUseCase {
  constructor(
    private readonly memberRepository: MemberRepository
  ) {}

  async execute(id: string): Promise<Member> {
    const member = await this.memberRepository.findById(id);
    if (!member) {
      throw new MemberNotFoundException(id);
    }
    return member;
  }
} 