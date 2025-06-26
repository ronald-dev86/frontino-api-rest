import { GetClientByIdUseCase } from '../../../../src/clients/application/use-cases/get-client-by-id.use-case';
import { ClientRepository } from '../../../../src/clients/application/ports/client.repository';
import { Client } from '../../../../src/clients/domain/entities/client.entity';
import { ClientType } from '../../../../src/clients/domain/enums/client-type.enum';
import { MembershipType } from '../../../../src/clients/domain/enums/membership-type.enum';
import { mock, instance, when, verify } from 'ts-mockito';
import { Agent } from '../../../../src/clients/domain/entities/agent.entity';
import { ClientNotFoundException } from '../../../../src/clients/domain/exceptions/client-not-found.exception';

describe('GetClientByIdUseCase', () => {
  let getClientByIdUseCase: GetClientByIdUseCase;
  let mockClientRepository: ClientRepository;

  beforeEach(() => {
    // Crear mock del repositorio
    mockClientRepository = mock<ClientRepository>();
    // Instanciar el caso de uso directamente
    getClientByIdUseCase = new GetClientByIdUseCase(instance(mockClientRepository));
  });

  it('debería obtener un cliente por su ID', async () => {
    // Arrange
    const clientId = 'client-1';
    const agent = new Agent('Agent Name', '123123123');

    const expectedClient = new Client(
      clientId,
      'Test Client',
      agent,
      true,
      '123456789',
      ClientType.RESIDENTIAL,
      MembershipType.BASIC,
      [],
      new Date().toISOString(),
      new Date().toISOString()
    );

    when(mockClientRepository.findById(clientId)).thenResolve(expectedClient);

    // Act
    const result = await getClientByIdUseCase.execute(clientId);

    // Assert
    expect(result).toEqual(expectedClient);
    verify(mockClientRepository.findById(clientId)).once();
  });

  it('debería lanzar una excepción si el cliente no existe', async () => {
    // Arrange
    const clientId = 'non-existent-id';
    when(mockClientRepository.findById(clientId)).thenResolve(null);

    // Act & Assert
    let errorMessage = '';
    let exceptionThrown = false;

    try {
      await getClientByIdUseCase.execute(clientId);
    } catch (error) {
      exceptionThrown = true;
      if (error instanceof Error) {
        errorMessage = error.message;
      }
    }
    
    expect(exceptionThrown).toBe(true);
    expect(errorMessage.includes(clientId)).toBe(true);
    verify(mockClientRepository.findById(clientId)).once();
  });
}); 