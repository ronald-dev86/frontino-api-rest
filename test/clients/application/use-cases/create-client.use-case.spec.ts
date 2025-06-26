import { CreateClientUseCase } from '../../../../src/clients/application/use-cases/create-client.use-case';
import { ClientRepository } from '../../../../src/clients/application/ports/client.repository';
import { CreateClientDto } from '../../../../src/clients/application/dtos/create-client.dto';
import { Client } from '../../../../src/clients/domain/entities/client.entity';
import { ClientType } from '../../../../src/clients/domain/enums/client-type.enum';
import { MembershipType } from '../../../../src/clients/domain/enums/membership-type.enum';
import { mock, instance, when, verify, anything } from 'ts-mockito';
import { Agent } from '../../../../src/clients/domain/entities/agent.entity';

describe('CreateClientUseCase', () => {
  let createClientUseCase: CreateClientUseCase;
  let mockClientRepository: ClientRepository;

  beforeEach(() => {
    // Crear mock del repositorio
    mockClientRepository = mock<ClientRepository>();
    // Instanciar el caso de uso directamente sin usar el módulo de prueba
    createClientUseCase = new CreateClientUseCase(instance(mockClientRepository));
  });

  it('debería crear un cliente correctamente', async () => {
    // Arrange
    const createClientDto: CreateClientDto = {
      name: 'Test Client',
      agent: {
        name: 'Agent Test',
        contactNumber: '987654321'
      },
      active: true,
      phone: '123456789',
      type: ClientType.RESIDENTIAL,
      membership: MembershipType.BASIC,
      gasCylinders: []
    };

    const agent = new Agent(
      createClientDto.agent.name,
      createClientDto.agent.contactNumber
    );

    const expectedClient = new Client(
      'test-id',
      createClientDto.name,
      agent,
      createClientDto.active,
      createClientDto.phone,
      createClientDto.type,
      createClientDto.membership,
      [],
      new Date().toISOString(),
      new Date().toISOString()
    );

    when(mockClientRepository.save(anything())).thenResolve(expectedClient);

    // Act
    const result = await createClientUseCase.execute(createClientDto);

    // Assert
    expect(result).toEqual(expectedClient);
    verify(mockClientRepository.save(anything())).once();
  });
}); 