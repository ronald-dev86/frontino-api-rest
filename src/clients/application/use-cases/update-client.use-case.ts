import { Injectable, Inject } from '@nestjs/common';
import { Client } from '../../domain/entities/client.entity';
import { ClientRepository } from '../ports/client.repository';
import { UpdateClientDto } from '../dtos/update-client.dto';
import { ClientNotFoundException } from '../../domain/exceptions/client-not-found.exception';
import { CLIENT_REPOSITORY } from '../../clients.module';
import { GasCylinder } from '../../domain/entities/gas-cylinder.entity';
import { Agent } from '../../domain/entities/agent.entity';

@Injectable()
export class UpdateClientUseCase {
  constructor(
    @Inject(CLIENT_REPOSITORY)
    private readonly clientRepository: ClientRepository
  ) {}

  async execute(id: string, updateClientDto: UpdateClientDto): Promise<Client> {
    const existingClient = await this.clientRepository.findById(id);
    
    if (!existingClient) {
      throw new ClientNotFoundException(id);
    }
    
    // Si se proporcionan cilindros de gas, mapearlos para eliminar fechas
    let gasCylinders = existingClient.gasCylinders;
    if (updateClientDto.gasCylinders !== undefined) {
      gasCylinders = updateClientDto.gasCylinders.map(gc => new GasCylinder(
        gc.id,
        gc.glMax,
        gc.glToLts,
      ));
    }
    
    // Actualizar el agente si se proporciona
    let agent = existingClient.agent;
    if (updateClientDto.agent !== undefined) {
      agent = new Agent(
        updateClientDto.agent.name,
        updateClientDto.agent.contactNumber,
      );
    }
    
    const updatedClient = new Client(
      existingClient.id,
      updateClientDto.name !== undefined ? updateClientDto.name : existingClient.name,
      agent,
      updateClientDto.active !== undefined ? updateClientDto.active : existingClient.active,
      updateClientDto.phone !== undefined ? updateClientDto.phone : existingClient.phone,
      updateClientDto.type !== undefined ? updateClientDto.type : existingClient.type,
      updateClientDto.membership !== undefined ? updateClientDto.membership : existingClient.membership,
      gasCylinders,
      existingClient.createdAt,
      new Date().toISOString()
    );
    
    return this.clientRepository.update(updatedClient);
  }
} 