import { GasCylinderRefill } from '../../domain/entities/gas-cylinder-refill.entity';
import { UniqueId } from '../../../shared/domain/types';

export interface GasCylinderRefillRepository {
  create(gasCylinderRefill: GasCylinderRefill): Promise<GasCylinderRefill>;
  findAll(): Promise<GasCylinderRefill[]>;
  findById(id: UniqueId): Promise<GasCylinderRefill>;
  findByGasCylinderId(gasCylinderId: UniqueId): Promise<GasCylinderRefill[]>;
  update(id: UniqueId, gasCylinderRefill: Partial<GasCylinderRefill>): Promise<GasCylinderRefill>;
  delete(id: UniqueId): Promise<void>;
} 