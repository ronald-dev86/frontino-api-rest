import { Client } from '../../domain/entities/client.entity';
import { UniqueId } from '../../../shared/domain/types';

export interface ClientRepository {
  findAll(): Promise<Client[]>;
  findById(id: UniqueId): Promise<Client | null>;
  save(client: Client): Promise<Client>;
  update(client: Client): Promise<Client>;
  delete(id: UniqueId): Promise<void>;
} 