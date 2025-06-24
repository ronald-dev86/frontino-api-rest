import { Injectable } from '@nestjs/common';
import { Member } from '../../domain/entities/member.entity';
import { Email } from '../../domain/value-objects/email.value-object';
import { InvalidMemberDataException } from '../../domain/exceptions/invalid-member-data.exception';
import { CreateMemberDto } from '../dtos/create-member.dto';
import { MemberRepository } from '../ports/member.repository';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class CreateMemberUseCase {
  constructor(
    private readonly memberRepository: MemberRepository
  ) {}

  async execute(createMemberDto: CreateMemberDto): Promise<Member> {
    try {
      const now = new Date().toISOString();
      
      const member = new Member(
        uuidv4(),
        createMemberDto.idClient,
        createMemberDto.name,
        createMemberDto.lastname,
        new Email(createMemberDto.email),
        createMemberDto.phone,
        createMemberDto.address,
        createMemberDto.meterSerial,
        createMemberDto.active,
        now,
        now
      );

      return await this.memberRepository.create(member);
    } catch (error) {
      if (error instanceof Error) {
        throw new InvalidMemberDataException(error.message);
      }
      throw new InvalidMemberDataException('Error desconocido al crear miembro');
    }
  }
} 