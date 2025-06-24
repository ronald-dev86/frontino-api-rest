import { Injectable } from '@nestjs/common';
import { ClientRepository } from '../../application/ports/client.repository';
import { Client } from '../../domain/entities/client.entity';
import { UniqueId } from '../../../shared/domain/types';
import { ClientNotFoundException } from '../../domain/exceptions/client-not-found.exception';

@Injectable()
export class InMemoryClientRepository implements ClientRepository {
  private clients: Map<string, Client> = new Map();

  async findAll(): Promise<Client[]> {
    return Array.from(this.clients.values());
  }

  async findById(id: UniqueId): Promise<Client | null> {
    const client = this.clients.get(id);
    return client || null;
  }

  async save(client: Client): Promise<Client> {
    this.clients.set(client.id, client);
    return client;
  }

  async update(client: Client): Promise<Client> {
    const exists = await this.findById(client.id);
    
    if (!exists) {
      throw new ClientNotFoundException(client.id);
    }
    
    this.clients.set(client.id, client);
    return client;
  }

  async delete(id: UniqueId): Promise<void> {
    const exists = await this.findById(id);
    
    if (!exists) {
      throw new ClientNotFoundException(id);
    }
    
    this.clients.delete(id);
  }
} 