import { Injectable, OnModuleInit } from '@nestjs/common';
import { GasBillRepository } from '../../application/ports/gas-bill.repository';
import { GasBill } from '../../domain/entities/gas-bill.entity';
import { GasBillNotFoundException } from '../../domain/exceptions/gas-bill-not-found.exception';
import { getFirestore, initializeFirebase } from '../../../config/firebase-config';
import { FirestoreGasBillAdapter } from '../adapters/firestore-gas-bill.adapter';

@Injectable()
export class FirestoreGasBillRepository implements GasBillRepository, OnModuleInit {
  private readonly COLLECTION_NAME = 'gas-bills';
  private firestore;

  async onModuleInit() {
    // Inicializar Firebase al iniciar el módulo
    initializeFirebase();
    this.firestore = getFirestore();
    console.log('FirestoreGasBillRepository inicializado');
  }

  async save(gasBill: GasBill): Promise<GasBill> {
    try {
      const gasBillData = FirestoreGasBillAdapter.toFirestoreData(gasBill);
      
      await this.firestore.collection(this.COLLECTION_NAME).doc(gasBill.id).set(gasBillData);
      
      return gasBill;
    } catch (error) {
      console.error('Error al guardar factura de gas:', error);
      throw error;
    }
  }

  async findAll(): Promise<GasBill[]> {
    try {
      const snapshot = await this.firestore.collection(this.COLLECTION_NAME).get();
      
      if (snapshot.empty) {
        return [];
      }

      return snapshot.docs.map(doc => FirestoreGasBillAdapter.toGasBill(doc.id, doc.data()));
    } catch (error) {
      console.error('Error al buscar todas las facturas de gas:', error);
      throw error;
    }
  }

  async findById(id: string): Promise<GasBill | null> {
    try {
      const doc = await this.firestore.collection(this.COLLECTION_NAME).doc(id).get();
      
      if (!doc.exists) {
        return null;
      }

      return FirestoreGasBillAdapter.toGasBill(doc.id, doc.data());
    } catch (error) {
      console.error(`Error al buscar factura de gas con ID ${id}:`, error);
      throw error;
    }
  }

  async findByTimeAndMember(time: string, idMember: string): Promise<GasBill | null> {
    try {
      const snapshot = await this.firestore
        .collection(this.COLLECTION_NAME)
        .where('time', '==', time)
        .where('idMember', '==', idMember)
        .limit(1)
        .get();
      
      if (snapshot.empty) {
        return null;
      }

      const doc = snapshot.docs[0];
      return FirestoreGasBillAdapter.toGasBill(doc.id, doc.data());
    } catch (error) {
      console.error(`Error al buscar factura por tiempo y miembro:`, error);
      throw error;
    }
  }

  async findInIdsMembers(idMembers: string[]): Promise<GasBill[]> {
    try {
      // Firebase no permite operadores 'in' con más de 10 elementos
      // Dividimos la consulta en bloques si es necesario
      let results: GasBill[] = [];
      
      for (let i = 0; i < idMembers.length; i += 10) {
        const batch = idMembers.slice(i, i + 10);
        
        if (batch.length > 0) {
          const snapshot = await this.firestore
            .collection(this.COLLECTION_NAME)
            .where('idMember', 'in', batch)
            .get();
          
          if (!snapshot.empty) {
            const batchResults = snapshot.docs.map(doc => 
              FirestoreGasBillAdapter.toGasBill(doc.id, doc.data())
            );
            results = [...results, ...batchResults];
          }
        }
      }
      
      return results;
    } catch (error) {
      console.error(`Error al buscar facturas por IDs de miembros:`, error);
      throw error;
    }
  }

  async update(id: string, gasBillData: Partial<GasBill>): Promise<GasBill> {
    try {
      const exists = await this.findById(id);
      
      if (!exists) {
        throw new GasBillNotFoundException(id);
      }
      
      // Preparar datos para actualizar
      const dataToUpdate: any = {};
      
      // Mapear solo los campos que se proporcionaron
      if (gasBillData.m3 !== undefined) dataToUpdate.m3 = gasBillData.m3;
      if (gasBillData.urlPhoto !== undefined) dataToUpdate.urlPhoto = gasBillData.urlPhoto;
      
      // Siempre actualizar la fecha de actualización
      dataToUpdate.updatedAt = new Date().toISOString();
      
      await this.firestore.collection(this.COLLECTION_NAME).doc(id).update(dataToUpdate);
      
      // Obtener la factura actualizada
      const updatedGasBill = await this.findById(id);
      if (!updatedGasBill) {
        throw new GasBillNotFoundException(id);
      }
      return updatedGasBill;
    } catch (error) {
      console.error(`Error al actualizar factura con ID ${id}:`, error);
      throw error;
    }
  }

  async delete(id: string): Promise<void> {
    try {
      const exists = await this.findById(id);
      
      if (!exists) {
        throw new GasBillNotFoundException(id);
      }
      
      await this.firestore.collection(this.COLLECTION_NAME).doc(id).delete();
    } catch (error) {
      console.error(`Error al eliminar factura con ID ${id}:`, error);
      throw error;
    }
  }
} 