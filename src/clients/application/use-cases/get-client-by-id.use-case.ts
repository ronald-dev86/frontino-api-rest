import { Injectable, Inject } from '@nestjs/common';
import { Client } from '../../domain/entities/client.entity';
import { ClientRepository } from '../ports/client.repository';
import { ClientNotFoundException } from '../../domain/exceptions/client-not-found.exception';
import { CLIENT_REPOSITORY } from '../../clients.module';

@Injectable()
export class GetClientByIdUseCase {
  constructor(
    @Inject(CLIENT_REPOSITORY)
    private readonly clientRepository: ClientRepository
  ) {}

  async execute(id: string): Promise<Client> {
    const client = await this.clientRepository.findById(id);
    
    if (!client) {
      throw new ClientNotFoundException(id);
    }
    
    return client;
  }
} 