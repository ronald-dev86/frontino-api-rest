import { Injectable } from '@nestjs/common';
import { GasCylinderRefillRepository } from '../../application/ports/gas-cylinder-refill.repository';
import { GasCylinderRefill } from '../../domain/entities/gas-cylinder-refill.entity';
import { GasCylinderRefillNotFoundException } from '../../domain/exceptions/gas-cylinder-refill-not-found.exception';
import { UniqueId } from '../../../shared/domain/types';

@Injectable()
export class InMemoryGasCylinderRefillRepository implements GasCylinderRefillRepository {
  private gasCylinderRefills: GasCylinderRefill[] = [];

  async create(gasCylinderRefill: GasCylinderRefill): Promise<GasCylinderRefill> {
    this.gasCylinderRefills.push(gasCylinderRefill);
    return gasCylinderRefill;
  }

  async findAll(): Promise<GasCylinderRefill[]> {
    return [...this.gasCylinderRefills];
  }

  async findById(id: UniqueId): Promise<GasCylinderRefill> {
    const gasCylinderRefill = this.gasCylinderRefills.find(refill => refill.id === id);
    if (!gasCylinderRefill) {
      throw new GasCylinderRefillNotFoundException(id);
    }
    return gasCylinderRefill;
  }

  async findByGasCylinderId(gasCylinderId: UniqueId): Promise<GasCylinderRefill[]> {
    return this.gasCylinderRefills.filter(refill => refill.idGasCylinder === gasCylinderId);
  }

  async update(id: UniqueId, updateData: Partial<GasCylinderRefill>): Promise<GasCylinderRefill> {
    const index = this.gasCylinderRefills.findIndex(refill => refill.id === id);
    if (index === -1) {
      throw new GasCylinderRefillNotFoundException(id);
    }

    const currentRefill = this.gasCylinderRefills[index];
    
    // Aplicar actualizaciones
    const updatedRefill = new GasCylinderRefill(
      currentRefill.id,
      currentRefill.idGasCylinder,
      updateData.fillingPercentage !== undefined ? updateData.fillingPercentage : currentRefill.fillingPercentage,
      updateData.fillingTime !== undefined ? updateData.fillingTime : currentRefill.fillingTime,
      updateData.urlVoucher !== undefined ? updateData.urlVoucher : currentRefill.urlVoucher,
      currentRefill.createdAt,
      new Date().toISOString(),
    );

    // Actualizar en la colección
    this.gasCylinderRefills[index] = updatedRefill;
    
    return updatedRefill;
  }

  async delete(id: UniqueId): Promise<void> {
    const index = this.gasCylinderRefills.findIndex(refill => refill.id === id);
    if (index === -1) {
      throw new GasCylinderRefillNotFoundException(id);
    }
    
    this.gasCylinderRefills.splice(index, 1);
  }
} 