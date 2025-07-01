import { Injectable } from '@nestjs/common';
import { AuthRepository } from '../../application/ports/auth.repository';
import { Auth } from '../../domain/entities/auth.entity';
import { AuthNotFoundException } from '../../domain/exceptions/auth-not-found.exception';
import { TokenNotFoundException } from '../../domain/exceptions/token-not-found.exception';
import { UniqueId } from '../../../shared/domain/types';

@Injectable()
export class InMemoryAuthRepository implements AuthRepository {
  private auths: Auth[] = [];

  async findAll(): Promise<Auth[]> {
    return [...this.auths];
  }

  async findById(id: UniqueId): Promise<Auth> {
    const auth = this.auths.find(a => a.id === id);
    if (!auth) {
      throw new AuthNotFoundException(id);
    }
    return auth;
  }

  async findByToken(token: string): Promise<Auth> {
    const auth = this.auths.find(a => a.token === token);
    if (!auth) {
      throw new TokenNotFoundException(token);
    }
    return auth;
  }

  async findByUserId(userId: UniqueId): Promise<Auth[]> {
    return this.auths.filter(a => a.idUser === userId);
  }

  async save(auth: Auth): Promise<Auth> {
    this.auths.push(auth);
    return auth;
  }

  async update(auth: Auth): Promise<Auth> {
    const index = this.auths.findIndex(a => a.id === auth.id);
    if (index === -1) {
      throw new AuthNotFoundException(auth.id);
    }
    this.auths[index] = auth;
    return auth;
  }

  async delete(id: UniqueId): Promise<void> {
    const index = this.auths.findIndex(a => a.id === id);
    if (index === -1) {
      throw new AuthNotFoundException(id);
    }
    this.auths.splice(index, 1);
  }
} 