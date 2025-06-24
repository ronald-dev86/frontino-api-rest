import { Injectable, Inject } from '@nestjs/common';
import { Client } from '../../domain/entities/client.entity';
import { ClientRepository } from '../ports/client.repository';
import { CreateClientDto, GasCylinderDTO } from '../dtos/create-client.dto';
import { CLIENT_REPOSITORY } from '../../clients.module';
import { v4 as uuidv4 } from 'uuid';
import { GasCylinder } from '../../domain/entities/gas-cylinder.entity';
import { Agent } from '../../domain/entities/agent.entity';

@Injectable()
export class CreateClientUseCase {
  constructor(
    @Inject(CLIENT_REPOSITORY)
    private readonly clientRepository: ClientRepository
  ) {}

  async execute(createClientDto: CreateClientDto): Promise<Client> {
    const now = new Date().toISOString();
    
    // Si se proporcionan cilindros de gas, mapearlos
    // Ahora generamos un ID único para cada cilindro
    const gasCylinders = createClientDto.gasCylinders 
      ? createClientDto.gasCylinders.map(gc => new GasCylinder(
          uuidv4(), // Generar un ID único para cada cilindro
          gc.glMax,
          gc.glToLts,
        ))
      : [];
    
    // Crear el agente
    const agent = new Agent(
      createClientDto.agent.name,
      createClientDto.agent.contactNumber,
    );
    
    const client = new Client(
      uuidv4(),
      createClientDto.name,
      agent,
      createClientDto.active,
      createClientDto.phone,
      createClientDto.type,
      createClientDto.membership,
      gasCylinders,
      now,
      now
    );

    return this.clientRepository.save(client);
  }
} 