import { Member } from '../../domain/entities/member.entity';

export interface MemberRepository {
  create(member: Member): Promise<Member>;
  findAll(): Promise<Member[]>;
  findById(id: string): Promise<Member | null>;
  findAllByClientId(clientId: string): Promise<Member[]>;
  update(id: string, member: Partial<Member>): Promise<Member>;
  delete(id: string): Promise<void>;
} 