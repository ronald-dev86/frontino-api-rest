import { Injectable, Inject } from '@nestjs/common';
import { ClientRepository } from '../ports/client.repository';
import { ClientNotFoundException } from '../../domain/exceptions/client-not-found.exception';
import { CLIENT_REPOSITORY } from '../../clients.module';

@Injectable()
export class DeleteClientUseCase {
  constructor(
    @Inject(CLIENT_REPOSITORY)
    private readonly clientRepository: ClientRepository
  ) {}

  async execute(id: string): Promise<void> {
    const client = await this.clientRepository.findById(id);
    
    if (!client) {
      throw new ClientNotFoundException(id);
    }
    
    return this.clientRepository.delete(id);
  }
} 