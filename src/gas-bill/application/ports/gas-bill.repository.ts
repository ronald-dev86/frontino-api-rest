import { GasBill } from '../../domain/entities/gas-bill.entity';

export interface GasBillRepository {
  save(gasBill: GasBill): Promise<GasBill>;
  findById(id: string): Promise<GasBill | null>;
  findAll(): Promise<GasBill[]>;
  findByTimeAndMember(time: string, idMember: string): Promise<GasBill | null>;
  findInIdsMembers(idMembers: string[]): Promise<GasBill[]>;
  update(id: string, gasBill: Partial<GasBill>): Promise<GasBill>;
  delete(id: string): Promise<void>;
} 