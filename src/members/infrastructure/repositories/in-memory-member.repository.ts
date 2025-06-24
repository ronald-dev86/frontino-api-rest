import { Injectable } from '@nestjs/common';
import { MemberRepository } from '../../application/ports/member.repository';
import { Member } from '../../domain/entities/member.entity';
import { MemberNotFoundException } from '../../domain/exceptions/member-not-found.exception';

@Injectable()
export class InMemoryMemberRepository implements MemberRepository {
  private members: Map<string, Member> = new Map();

  async create(member: Member): Promise<Member> {
    this.members.set(member.id, member);
    return member;
  }

  async findAll(): Promise<Member[]> {
    return Array.from(this.members.values());
  }

  async findById(id: string): Promise<Member | null> {
    const member = this.members.get(id);
    return member || null;
  }

  async findByMeterSerial(meterSerial: string): Promise<Member | null> {
    const member = Array.from(this.members.values()).find(
      member => member.meterSerial === meterSerial
    );
    return member || null;
  }

  async findAllByClientId(clientId: string): Promise<Member[]> {
    return Array.from(this.members.values()).filter(
      member => member.idClient === clientId
    );
  }

  async update(id: string, memberData: Partial<Member>): Promise<Member> {
    const existing = await this.findById(id);
    
    if (!existing) {
      throw new MemberNotFoundException(id);
    }

    // Crear una versión actualizada del miembro
    // Nota: Este enfoque es simplificado y podría necesitar ajustes
    const updated = Object.assign(existing, memberData);
    
    this.members.set(id, updated);
    return updated;
  }

  async delete(id: string): Promise<void> {
    const exists = await this.findById(id);
    
    if (!exists) {
      throw new MemberNotFoundException(id);
    }
    
    this.members.delete(id);
  }
} 