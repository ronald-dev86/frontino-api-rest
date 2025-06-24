import { Injectable } from '@nestjs/common';
import { MemberRepository } from '../ports/member.repository';
import { MemberNotFoundException } from '../../domain/exceptions/member-not-found.exception';

@Injectable()
export class DeleteMemberUseCase {
  constructor(
    private readonly memberRepository: MemberRepository
  ) {}

  async execute(id: string): Promise<void> {
    const member = await this.memberRepository.findById(id);
    if (!member) {
      throw new MemberNotFoundException(id);
    }

    await this.memberRepository.delete(id);
  }
} 