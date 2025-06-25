import { Injectable } from '@nestjs/common';
import { GasBillRepository } from '../../application/ports/gas-bill.repository';
import { GasBill } from '../../domain/entities/gas-bill.entity';

@Injectable()
export class InMemoryGasBillRepository implements GasBillRepository {
  private gasBills: GasBill[] = [];

  async save(gasBill: GasBill): Promise<GasBill> {
    this.gasBills.push(gasBill);
    return gasBill;
  }

  async findById(id: string): Promise<GasBill | null> {
    const gasBill = this.gasBills.find(bill => bill.id === id);
    return gasBill || null;
  }

  async findAll(): Promise<GasBill[]> {
    return [...this.gasBills];
  }

  async findByTimeAndMember(time: string, idMember: string): Promise<GasBill | null> {
    const gasBill = this.gasBills.find(
      bill => bill.time === time && bill.idMember === idMember
    );
    return gasBill || null;
  }

  async findInIdsMembers(idMembers: string[]): Promise<GasBill[]> {
    return this.gasBills.filter(bill => idMembers.includes(bill.idMember));
  }

  async update(id: string, gasBillData: Partial<GasBill>): Promise<GasBill> {
    const index = this.gasBills.findIndex(bill => bill.id === id);
    
    if (index === -1) {
      throw new Error(`GasBill con ID ${id} no encontrado`);
    }
    
    const currentGasBill = this.gasBills[index];
    const updatedGasBill = new GasBill(
      currentGasBill.id,
      currentGasBill.idMember,
      currentGasBill.time,
      gasBillData.m3 !== undefined ? gasBillData.m3 : currentGasBill.m3,
      gasBillData.urlPhoto !== undefined ? gasBillData.urlPhoto : currentGasBill.urlPhoto,
      currentGasBill.createdAt,
      new Date().toISOString()
    );
    
    this.gasBills[index] = updatedGasBill;
    return updatedGasBill;
  }

  async delete(id: string): Promise<void> {
    const index = this.gasBills.findIndex(bill => bill.id === id);
    
    if (index === -1) {
      throw new Error(`GasBill con ID ${id} no encontrado`);
    }
    
    this.gasBills.splice(index, 1);
  }
} 