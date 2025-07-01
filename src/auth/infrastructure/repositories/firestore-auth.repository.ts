import { Injectable, OnModuleInit } from '@nestjs/common';
import { AuthRepository } from '../../application/ports/auth.repository';
import { Auth } from '../../domain/entities/auth.entity';
import { AuthNotFoundException } from '../../domain/exceptions/auth-not-found.exception';
import { TokenNotFoundException } from '../../domain/exceptions/token-not-found.exception';
import { getFirestore, initializeFirebase } from '../../../config/firebase-config';
import { FirestoreAuthAdapter } from '../adapters/firestore-auth.adapter';
import { UniqueId } from '../../../shared/domain/types';

@Injectable()
export class FirestoreAuthRepository implements AuthRepository, OnModuleInit {
  private readonly COLLECTION_NAME = 'auths';
  private firestore;

  async onModuleInit() {
    // Inicializar Firebase al iniciar el módulo
    initializeFirebase();
    this.firestore = getFirestore();
    console.log('FirestoreAuthRepository inicializado');
  }

  async findAll(): Promise<Auth[]> {
    try {
      const snapshot = await this.firestore.collection(this.COLLECTION_NAME).get();
      
      if (snapshot.empty) {
        return [];
      }

      return snapshot.docs.map(doc => FirestoreAuthAdapter.fromFirestore(doc.data()));
    } catch (error) {
      console.error('Error al buscar todas las autenticaciones:', error);
      throw error;
    }
  }

  async findById(id: UniqueId): Promise<Auth> {
    try {
      const doc = await this.firestore.collection(this.COLLECTION_NAME).doc(id).get();
      
      if (!doc.exists) {
        throw new AuthNotFoundException(id);
      }

      return FirestoreAuthAdapter.fromFirestore(doc.data());
    } catch (error) {
      console.error(`Error al buscar autenticación con ID ${id}:`, error);
      throw error;
    }
  }

  async findByToken(token: string): Promise<Auth> {
    try {
      const snapshot = await this.firestore.collection(this.COLLECTION_NAME)
        .where('token', '==', token)
        .limit(1)
        .get();
      
      if (snapshot.empty) {
        throw new TokenNotFoundException(token);
      }

      return FirestoreAuthAdapter.fromFirestore(snapshot.docs[0].data());
    } catch (error) {
      console.error(`Error al buscar autenticación con token ${token.substring(0, 10)}...:`, error);
      throw error;
    }
  }

  async findByUserId(userId: UniqueId): Promise<Auth[]> {
    try {
      const snapshot = await this.firestore.collection(this.COLLECTION_NAME)
        .where('idUser', '==', userId)
        .get();
      
      if (snapshot.empty) {
        return [];
      }

      return snapshot.docs.map(doc => FirestoreAuthAdapter.fromFirestore(doc.data()));
    } catch (error) {
      console.error(`Error al buscar autenticaciones del usuario ${userId}:`, error);
      throw error;
    }
  }

  async save(auth: Auth): Promise<Auth> {
    try {
      const authData = FirestoreAuthAdapter.toFirestore(auth);
      
      await this.firestore.collection(this.COLLECTION_NAME).doc(auth.id).set(authData);
      
      return auth;
    } catch (error) {
      console.error('Error al guardar autenticación:', error);
      throw error;
    }
  }

  async update(auth: Auth): Promise<Auth> {
    try {
      const existingAuth = await this.findById(auth.id);
      
      if (!existingAuth) {
        throw new AuthNotFoundException(auth.id);
      }
      
      const authData = FirestoreAuthAdapter.toFirestore(auth);
      
      await this.firestore.collection(this.COLLECTION_NAME).doc(auth.id).update(authData);
      
      return auth;
    } catch (error) {
      console.error(`Error al actualizar autenticación con ID ${auth.id}:`, error);
      throw error;
    }
  }

  async delete(id: UniqueId): Promise<void> {
    try {
      const exists = await this.findById(id);
      
      if (!exists) {
        throw new AuthNotFoundException(id);
      }
      
      await this.firestore.collection(this.COLLECTION_NAME).doc(id).delete();
    } catch (error) {
      console.error(`Error al eliminar autenticación con ID ${id}:`, error);
      throw error;
    }
  }
} 