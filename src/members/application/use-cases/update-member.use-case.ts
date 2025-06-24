import { Injectable } from '@nestjs/common';
import { Member } from '../../domain/entities/member.entity';
import { MemberRepository } from '../ports/member.repository';
import { UpdateMemberDto } from '../dtos/update-member.dto';
import { MemberNotFoundException } from '../../domain/exceptions/member-not-found.exception';
import { InvalidMemberDataException } from '../../domain/exceptions/invalid-member-data.exception';
import { DuplicateMeterSerialException } from '../../domain/exceptions/duplicate-meter-serial.exception';

@Injectable()
export class UpdateMemberUseCase {
  constructor(
    private readonly memberRepository: MemberRepository
  ) {}

  async execute(id: string, updateMemberDto: UpdateMemberDto): Promise<Member> {
    try {
      // Verificar si el miembro existe
      const existingMember = await this.memberRepository.findById(id);
      if (!existingMember) {
        throw new MemberNotFoundException(id);
      }

      // Verificar que el número de serie del medidor no está duplicado si se está actualizando
      if (updateMemberDto.meterSerial !== undefined && 
          updateMemberDto.meterSerial !== existingMember.meterSerial) {
        const memberWithSameSerial = await this.memberRepository.findByMeterSerial(updateMemberDto.meterSerial);
        if (memberWithSameSerial) {
          throw new DuplicateMeterSerialException(updateMemberDto.meterSerial);
        }
      }

      // Preparar el objeto para actualizar
      const dataToUpdate: Partial<Member> = {};

      if (updateMemberDto.name !== undefined) {
        dataToUpdate['name'] = updateMemberDto.name;
      }

      if (updateMemberDto.lastname !== undefined) {
        dataToUpdate['lastname'] = updateMemberDto.lastname;
      }

      if (updateMemberDto.email !== undefined) {
        dataToUpdate['email'] = updateMemberDto.email;
      }

      if (updateMemberDto.phone !== undefined) {
        dataToUpdate['phone'] = updateMemberDto.phone;
      }

      if (updateMemberDto.address !== undefined) {
        dataToUpdate['address'] = updateMemberDto.address;
      }

      if (updateMemberDto.meterSerial !== undefined) {
        dataToUpdate['meterSerial'] = updateMemberDto.meterSerial;
      }

      if (updateMemberDto.active !== undefined) {
        dataToUpdate['active'] = updateMemberDto.active;
      }

      return await this.memberRepository.update(id, dataToUpdate);
    } catch (error) {
      if (error instanceof MemberNotFoundException || error instanceof DuplicateMeterSerialException) {
        throw error;
      }
      if (error instanceof Error) {
        throw new InvalidMemberDataException(error.message);
      }
      throw new InvalidMemberDataException('Error desconocido al actualizar miembro');
    }
  }
} 