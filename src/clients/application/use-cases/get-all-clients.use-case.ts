import { Injectable, Inject } from '@nestjs/common';
import { Client } from '../../domain/entities/client.entity';
import { ClientRepository } from '../ports/client.repository';
import { CLIENT_REPOSITORY } from '../../clients.module';

@Injectable()
export class GetAllClientsUseCase {
  constructor(
    @Inject(CLIENT_REPOSITORY)
    private readonly clientRepository: ClientRepository
  ) {}

  async execute(): Promise<Client[]> {
    return this.clientRepository.findAll();
  }
} 