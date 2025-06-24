import { Injectable, OnModuleInit } from '@nestjs/common';
import { GasCylinderRefillRepository } from '../../application/ports/gas-cylinder-refill.repository';
import { GasCylinderRefill } from '../../domain/entities/gas-cylinder-refill.entity';
import { UniqueId } from '../../../shared/domain/types';
import { GasCylinderRefillNotFoundException } from '../../domain/exceptions/gas-cylinder-refill-not-found.exception';
import { getFirestore, initializeFirebase } from '../../../config/firebase-config';
import { FirestoreGasCylinderRefillAdapter } from '../adapters/firestore-gas-cylinder-refill.adapter';

@Injectable()
export class FirestoreGasCylinderRefillRepository implements GasCylinderRefillRepository, OnModuleInit {
  private readonly COLLECTION_NAME = 'gas-cylinder-refills';
  private firestore;

  async onModuleInit() {
    // Inicializar Firebase al iniciar el módulo
    initializeFirebase();
    this.firestore = getFirestore();
    console.log('FirestoreGasCylinderRefillRepository inicializado');
  }

  async create(gasCylinderRefill: GasCylinderRefill): Promise<GasCylinderRefill> {
    try {
      const refillData = FirestoreGasCylinderRefillAdapter.toFirestoreData(gasCylinderRefill);
      
      await this.firestore.collection(this.COLLECTION_NAME).doc(gasCylinderRefill.id).set(refillData);
      
      return gasCylinderRefill;
    } catch (error) {
      console.error('Error al crear recarga de cilindro:', error);
      throw error;
    }
  }

  async findAll(): Promise<GasCylinderRefill[]> {
    try {
      const snapshot = await this.firestore.collection(this.COLLECTION_NAME).get();
      
      if (snapshot.empty) {
        return [];
      }

      return snapshot.docs.map(doc => FirestoreGasCylinderRefillAdapter.toGasCylinderRefill(doc.id, doc.data()));
    } catch (error) {
      console.error('Error al buscar todas las recargas:', error);
      throw error;
    }
  }

  async findById(id: UniqueId): Promise<GasCylinderRefill> {
    try {
      const doc = await this.firestore.collection(this.COLLECTION_NAME).doc(id).get();
      
      if (!doc.exists) {
        throw new GasCylinderRefillNotFoundException(id);
      }

      return FirestoreGasCylinderRefillAdapter.toGasCylinderRefill(doc.id, doc.data());
    } catch (error) {
      console.error(`Error al buscar recarga con ID ${id}:`, error);
      throw error;
    }
  }

  async findByGasCylinderId(gasCylinderId: UniqueId): Promise<GasCylinderRefill[]> {
    try {
      const snapshot = await this.firestore
        .collection(this.COLLECTION_NAME)
        .where('idGasCylinder', '==', gasCylinderId)
        .get();
      
      if (snapshot.empty) {
        return [];
      }

      return snapshot.docs.map(doc => 
        FirestoreGasCylinderRefillAdapter.toGasCylinderRefill(doc.id, doc.data())
      );
    } catch (error) {
      console.error(`Error al buscar recargas para el cilindro con ID ${gasCylinderId}:`, error);
      throw error;
    }
  }

  async update(id: UniqueId, gasCylinderRefill: Partial<GasCylinderRefill>): Promise<GasCylinderRefill> {
    try {
      const currentRefill = await this.findById(id);
      
      // Solo actualiza los campos proporcionados
      if (gasCylinderRefill.fillingPercentage !== undefined) {
        currentRefill['fillingPercentage'] = gasCylinderRefill.fillingPercentage;
      }
      
      if (gasCylinderRefill.fillingTime !== undefined) {
        currentRefill['fillingTime'] = gasCylinderRefill.fillingTime;
      }
      
      if (gasCylinderRefill.urlVoucher !== undefined) {
        currentRefill['urlVoucher'] = gasCylinderRefill.urlVoucher;
      }

      // Crear una nueva instancia para actualizar el timestamp
      const updatedRefill = new GasCylinderRefill(
        currentRefill.id,
        currentRefill.idGasCylinder,
        gasCylinderRefill.fillingPercentage !== undefined ? gasCylinderRefill.fillingPercentage : currentRefill.fillingPercentage,
        gasCylinderRefill.fillingTime !== undefined ? gasCylinderRefill.fillingTime : currentRefill.fillingTime,
        gasCylinderRefill.urlVoucher !== undefined ? gasCylinderRefill.urlVoucher : currentRefill.urlVoucher,
        currentRefill.createdAt,
        new Date().toISOString()
      );
      
      const refillData = FirestoreGasCylinderRefillAdapter.toFirestoreData(updatedRefill);
      
      await this.firestore.collection(this.COLLECTION_NAME).doc(id).update(refillData);
      
      return updatedRefill;
    } catch (error) {
      if (error instanceof GasCylinderRefillNotFoundException) {
        throw error;
      }
      console.error(`Error al actualizar recarga con ID ${id}:`, error);
      throw error;
    }
  }

  async delete(id: UniqueId): Promise<void> {
    try {
      const doc = await this.firestore.collection(this.COLLECTION_NAME).doc(id).get();
      
      if (!doc.exists) {
        throw new GasCylinderRefillNotFoundException(id);
      }
      
      await this.firestore.collection(this.COLLECTION_NAME).doc(id).delete();
    } catch (error) {
      if (error instanceof GasCylinderRefillNotFoundException) {
        throw error;
      }
      console.error(`Error al eliminar recarga con ID ${id}:`, error);
      throw error;
    }
  }
} 