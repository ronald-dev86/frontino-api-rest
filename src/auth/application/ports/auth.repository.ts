import { Auth } from '../../domain/entities/auth.entity';
import { UniqueId } from '../../../shared/domain/types';

export interface AuthRepository {
  findAll(): Promise<Auth[]>;
  findById(id: UniqueId): Promise<Auth>;
  findByToken(token: string): Promise<Auth>;
  findByUserId(userId: UniqueId): Promise<Auth[]>;
  save(auth: Auth): Promise<Auth>;
  update(auth: Auth): Promise<Auth>;
  delete(id: UniqueId): Promise<void>;
} 