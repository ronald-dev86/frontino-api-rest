import { Injectable, OnModuleInit } from '@nestjs/common';
import { UserRepository } from '../../application/ports/user.repository';
import { User } from '../../domain/entities/user.entity';
import { UserNotFoundException } from '../../domain/exceptions/user-not-found.exception';
import { getFirestore, initializeFirebase } from '../../../config/firebase-config';
import { FirestoreUserAdapter } from '../adapters/firestore-user.adapter';

@Injectable()
export class FirestoreUserRepository implements UserRepository, OnModuleInit {
  private readonly COLLECTION_NAME = 'users';
  private firestore;

  async onModuleInit() {
    // Inicializar Firebase al iniciar el módulo
    initializeFirebase();
    this.firestore = getFirestore();
    console.log('FirestoreUserRepository inicializado');
  }

  async findAll(): Promise<User[]> {
    try {
      const snapshot = await this.firestore.collection(this.COLLECTION_NAME).get();
      
      if (snapshot.empty) {
        return [];
      }

      return snapshot.docs.map(doc => FirestoreUserAdapter.fromFirestore(doc.data()));
    } catch (error) {
      console.error('Error al buscar todos los usuarios:', error);
      throw error;
    }
  }

  async findById(id: string): Promise<User> {
    try {
      const doc = await this.firestore.collection(this.COLLECTION_NAME).doc(id).get();
      
      if (!doc.exists) {
        throw new UserNotFoundException(id);
      }

      return FirestoreUserAdapter.fromFirestore(doc.data());
    } catch (error) {
      console.error(`Error al buscar usuario con ID ${id}:`, error);
      throw error;
    }
  }

  async findByEmail(email: string): Promise<User> {
    try {
      const snapshot = await this.firestore.collection(this.COLLECTION_NAME)
        .where('email', '==', email)
        .limit(1)
        .get();
      
      if (snapshot.empty) {
        throw new Error(`Usuario con email ${email} no encontrado`);
      }

      return FirestoreUserAdapter.fromFirestore(snapshot.docs[0].data());
    } catch (error) {
      console.error(`Error al buscar usuario con email ${email}:`, error);
      throw error;
    }
  }

  async save(user: User): Promise<User> {
    try {
      const userData = FirestoreUserAdapter.toFirestore(user);
      
      await this.firestore.collection(this.COLLECTION_NAME).doc(user.id).set(userData);
      
      return user;
    } catch (error) {
      console.error('Error al guardar usuario:', error);
      throw error;
    }
  }

  async update(id: string, userData: Partial<User>): Promise<User> {
    try {
      const existingUser = await this.findById(id);
      
      if (!existingUser) {
        throw new UserNotFoundException(id);
      }
      
      // Actualizar propiedades usando setters
      if (userData.idAssociatedAccounts !== undefined) {
        existingUser.idAssociatedAccounts = userData.idAssociatedAccounts;
      }
      
      if (userData.email !== undefined) {
        existingUser.email = userData.email;
      }
      
      if (userData.password !== undefined) {
        existingUser.password = userData.password;
      }
      
      if (userData.rol !== undefined) {
        existingUser.rol = userData.rol;
      }
      
      if (userData.active !== undefined) {
        existingUser.active = userData.active;
      }
      
      const updatedUserData = FirestoreUserAdapter.toFirestore(existingUser);
      
      await this.firestore.collection(this.COLLECTION_NAME).doc(id).update(updatedUserData);
      
      return existingUser;
    } catch (error) {
      console.error(`Error al actualizar usuario con ID ${id}:`, error);
      throw error;
    }
  }

  async delete(id: string): Promise<void> {
    try {
      const exists = await this.findById(id);
      
      if (!exists) {
        throw new UserNotFoundException(id);
      }
      
      await this.firestore.collection(this.COLLECTION_NAME).doc(id).delete();
    } catch (error) {
      console.error(`Error al eliminar usuario con ID ${id}:`, error);
      throw error;
    }
  }
} 