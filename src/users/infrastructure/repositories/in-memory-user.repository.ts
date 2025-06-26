import { Injectable } from '@nestjs/common';
import { User } from '../../domain/entities/user.entity';
import { UserRepository } from '../../application/ports/user.repository';
import { UserNotFoundException } from '../../domain/exceptions/user-not-found.exception';

@Injectable()
export class InMemoryUserRepository implements UserRepository {
  private users: User[] = [];

  async findAll(): Promise<User[]> {
    return [...this.users];
  }

  async findById(id: string): Promise<User> {
    const user = this.users.find((u) => u.id === id);
    if (!user) {
      throw new UserNotFoundException(id);
    }
    return user;
  }

  async findByEmail(email: string): Promise<User> {
    const user = this.users.find((u) => u.email === email);
    if (!user) {
      throw new Error(`Usuario con email ${email} no encontrado`);
    }
    return user;
  }

  async save(user: User): Promise<User> {
    this.users.push(user);
    return user;
  }

  async update(id: string, userData: Partial<User>): Promise<User> {
    const userIndex = this.users.findIndex((u) => u.id === id);
    if (userIndex === -1) {
      throw new UserNotFoundException(id);
    }

    const user = this.users[userIndex];
    
    // Actualizar propiedades usando setters
    if (userData.idAssociatedAccounts !== undefined) {
      user.idAssociatedAccounts = userData.idAssociatedAccounts;
    }
    
    if (userData.email !== undefined) {
      user.email = userData.email;
    }
    
    if (userData.password !== undefined) {
      user.password = userData.password;
    }
    
    if (userData.rol !== undefined) {
      user.rol = userData.rol;
    }
    
    if (userData.active !== undefined) {
      user.active = userData.active;
    }
    
    this.users[userIndex] = user;
    return user;
  }

  async delete(id: string): Promise<void> {
    const userIndex = this.users.findIndex((u) => u.id === id);
    if (userIndex === -1) {
      throw new UserNotFoundException(id);
    }
    this.users.splice(userIndex, 1);
  }
} 