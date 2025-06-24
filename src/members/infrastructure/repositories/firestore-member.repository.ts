import { Injectable, OnModuleInit } from '@nestjs/common';
import { MemberRepository } from '../../application/ports/member.repository';
import { Member } from '../../domain/entities/member.entity';
import { MemberNotFoundException } from '../../domain/exceptions/member-not-found.exception';
import { getFirestore, initializeFirebase } from '../../../config/firebase-config';
import { FirestoreMemberAdapter } from '../adapters/firestore-member.adapter';

@Injectable()
export class FirestoreMemberRepository implements MemberRepository, OnModuleInit {
  private readonly COLLECTION_NAME = 'members';
  private firestore;

  async onModuleInit() {
    // Inicializar Firebase al iniciar el módulo
    initializeFirebase();
    this.firestore = getFirestore();
    console.log('FirestoreMemberRepository inicializado');
  }

  async create(member: Member): Promise<Member> {
    try {
      const memberData = FirestoreMemberAdapter.toFirestoreData(member);
      
      await this.firestore.collection(this.COLLECTION_NAME).doc(member.id).set(memberData);
      
      return member;
    } catch (error) {
      console.error('Error al crear miembro:', error);
      throw error;
    }
  }

  async findAll(): Promise<Member[]> {
    try {
      const snapshot = await this.firestore.collection(this.COLLECTION_NAME).get();
      
      if (snapshot.empty) {
        return [];
      }

      return snapshot.docs.map(doc => FirestoreMemberAdapter.toMember(doc.id, doc.data()));
    } catch (error) {
      console.error('Error al buscar todos los miembros:', error);
      throw error;
    }
  }

  async findById(id: string): Promise<Member | null> {
    try {
      const doc = await this.firestore.collection(this.COLLECTION_NAME).doc(id).get();
      
      if (!doc.exists) {
        return null;
      }

      return FirestoreMemberAdapter.toMember(doc.id, doc.data());
    } catch (error) {
      console.error(`Error al buscar miembro con ID ${id}:`, error);
      throw error;
    }
  }

  async findAllByClientId(clientId: string): Promise<Member[]> {
    try {
      const snapshot = await this.firestore
        .collection(this.COLLECTION_NAME)
        .where('idClient', '==', clientId)
        .get();
      
      if (snapshot.empty) {
        return [];
      }

      return snapshot.docs.map(doc => FirestoreMemberAdapter.toMember(doc.id, doc.data()));
    } catch (error) {
      console.error(`Error al buscar miembros por ID de cliente ${clientId}:`, error);
      throw error;
    }
  }

  async update(id: string, memberData: Partial<Member>): Promise<Member> {
    try {
      const exists = await this.findById(id);
      
      if (!exists) {
        throw new MemberNotFoundException(id);
      }
      
      // Preparar datos para actualizar
      const dataToUpdate: any = {};
      
      // Mapear solo los campos que se proporcionaron
      if (memberData.name !== undefined) dataToUpdate.name = memberData.name;
      if (memberData.lastname !== undefined) dataToUpdate.lastname = memberData.lastname;
      if (memberData.email !== undefined) dataToUpdate.email = memberData.email;
      if (memberData.phone !== undefined) dataToUpdate.phone = memberData.phone;
      if (memberData.address !== undefined) dataToUpdate.address = memberData.address;
      if (memberData.meterSerial !== undefined) dataToUpdate.meterSerial = memberData.meterSerial;
      if (memberData.active !== undefined) dataToUpdate.active = memberData.active;
      
      // Siempre actualizar la fecha de actualización
      dataToUpdate.updatedAt = new Date().toISOString();
      
      await this.firestore.collection(this.COLLECTION_NAME).doc(id).update(dataToUpdate);
      
      // Obtener el miembro actualizado
      const updatedMember = await this.findById(id);
      if (!updatedMember) {
        throw new MemberNotFoundException(id);
      }
      return updatedMember;
    } catch (error) {
      console.error(`Error al actualizar miembro con ID ${id}:`, error);
      throw error;
    }
  }

  async delete(id: string): Promise<void> {
    try {
      const exists = await this.findById(id);
      
      if (!exists) {
        throw new MemberNotFoundException(id);
      }
      
      await this.firestore.collection(this.COLLECTION_NAME).doc(id).delete();
    } catch (error) {
      console.error(`Error al eliminar miembro con ID ${id}:`, error);
      throw error;
    }
  }
} 