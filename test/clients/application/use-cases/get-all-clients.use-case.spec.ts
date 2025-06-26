import { GetAllClientsUseCase } from '../../../../src/clients/application/use-cases/get-all-clients.use-case';
import { ClientRepository } from '../../../../src/clients/application/ports/client.repository';
import { Client } from '../../../../src/clients/domain/entities/client.entity';
import { ClientType } from '../../../../src/clients/domain/enums/client-type.enum';
import { MembershipType } from '../../../../src/clients/domain/enums/membership-type.enum';
import { mock, instance, when, verify } from 'ts-mockito';
import { Agent } from '../../../../src/clients/domain/entities/agent.entity';

describe('GetAllClientsUseCase', () => {
  let getAllClientsUseCase: GetAllClientsUseCase;
  let mockClientRepository: ClientRepository;

  beforeEach(() => {
    // Crear mock del repositorio
    mockClientRepository = mock<ClientRepository>();
    // Instanciar el caso de uso directamente
    getAllClientsUseCase = new GetAllClientsUseCase(instance(mockClientRepository));
  });

  it('debería obtener todos los clientes', async () => {
    // Arrange
    const agent1 = new Agent('Agent 1', '123123123');
    const agent2 = new Agent('Agent 2', '456456456');

    const expectedClients = [
      new Client(
        'client-1',
        'Client 1',
        agent1,
        true,
        '123456789',
        ClientType.RESIDENTIAL,
        MembershipType.BASIC,
        [],
        new Date().toISOString(),
        new Date().toISOString(),
      ),
      new Client(
        'client-2',
        'Client 2',
        agent2,
        true,
        '987654321',
        ClientType.COMMERCIAL,
        MembershipType.PREMIUM,
        [],
        new Date().toISOString(),
        new Date().toISOString(),
      ),
    ];

    when(mockClientRepository.findAll()).thenResolve(expectedClients);

    // Act
    const result = await getAllClientsUseCase.execute();

    // Assert
    expect(result).toEqual(expectedClients);
    verify(mockClientRepository.findAll()).once();
  });

  it('debería devolver un array vacío cuando no hay clientes', async () => {
    // Arrange
    when(mockClientRepository.findAll()).thenResolve([]);

    // Act
    const result = await getAllClientsUseCase.execute();

    // Assert
    expect(result).toEqual([]);
    expect(result.length).toBe(0);
    verify(mockClientRepository.findAll()).once();
  });
}); 