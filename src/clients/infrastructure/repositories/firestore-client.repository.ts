import { Injectable, OnModuleInit } from '@nestjs/common';
import { ClientRepository } from '../../application/ports/client.repository';
import { Client } from '../../domain/entities/client.entity';
import { UniqueId } from '../../../shared/domain/types';
import { ClientNotFoundException } from '../../domain/exceptions/client-not-found.exception';
import { getFirestore, initializeFirebase } from '../../../config/firebase-config';
import { FirestoreClientAdapter } from '../adapters/firestore-client.adapter';

@Injectable()
export class FirestoreClientRepository implements ClientRepository, OnModuleInit {
  private readonly COLLECTION_NAME = 'clients';
  private firestore;

  async onModuleInit() {
    // Inicializar Firebase al iniciar el módulo
    initializeFirebase();
    this.firestore = getFirestore();
    console.log('FirestoreClientRepository inicializado');
  }

  async findAll(): Promise<Client[]> {
    try {
      const snapshot = await this.firestore.collection(this.COLLECTION_NAME).get();
      
      if (snapshot.empty) {
        return [];
      }

      return snapshot.docs.map(doc => FirestoreClientAdapter.toClient(doc.id, doc.data()));
    } catch (error) {
      console.error('Error al buscar todos los clientes:', error);
      throw error;
    }
  }

  async findById(id: UniqueId): Promise<Client | null> {
    try {
      const doc = await this.firestore.collection(this.COLLECTION_NAME).doc(id).get();
      
      if (!doc.exists) {
        return null;
      }

      return FirestoreClientAdapter.toClient(doc.id, doc.data());
    } catch (error) {
      console.error(`Error al buscar cliente con ID ${id}:`, error);
      throw error;
    }
  }

  async save(client: Client): Promise<Client> {
    try {
      const clientData = FirestoreClientAdapter.toFirestoreData(client);
      
      await this.firestore.collection(this.COLLECTION_NAME).doc(client.id).set(clientData);
      
      return client;
    } catch (error) {
      console.error('Error al guardar cliente:', error);
      throw error;
    }
  }

  async update(client: Client): Promise<Client> {
    try {
      const exists = await this.findById(client.id);
      
      if (!exists) {
        throw new ClientNotFoundException(client.id);
      }
      
      const clientData = FirestoreClientAdapter.toFirestoreData(client);
      
      await this.firestore.collection(this.COLLECTION_NAME).doc(client.id).update(clientData);
      
      return client;
    } catch (error) {
      console.error(`Error al actualizar cliente con ID ${client.id}:`, error);
      throw error;
    }
  }

  async delete(id: UniqueId): Promise<void> {
    try {
      const exists = await this.findById(id);
      
      if (!exists) {
        throw new ClientNotFoundException(id);
      }
      
      await this.firestore.collection(this.COLLECTION_NAME).doc(id).delete();
    } catch (error) {
      console.error(`Error al eliminar cliente con ID ${id}:`, error);
      throw error;
    }
  }
} 