import { DeleteClientUseCase } from '../../../../src/clients/application/use-cases/delete-client.use-case';
import { ClientRepository } from '../../../../src/clients/application/ports/client.repository';
import { Client } from '../../../../src/clients/domain/entities/client.entity';
import { ClientType } from '../../../../src/clients/domain/enums/client-type.enum';
import { MembershipType } from '../../../../src/clients/domain/enums/membership-type.enum';
import { mock, instance, when, verify, anything } from 'ts-mockito';
import { Agent } from '../../../../src/clients/domain/entities/agent.entity';
import { ClientNotFoundException } from '../../../../src/clients/domain/exceptions/client-not-found.exception';

describe('DeleteClientUseCase', () => {
  let deleteClientUseCase: DeleteClientUseCase;
  let mockClientRepository: ClientRepository;

  beforeEach(() => {
    // Crear mock del repositorio
    mockClientRepository = mock<ClientRepository>();
    // Instanciar el caso de uso directamente
    deleteClientUseCase = new DeleteClientUseCase(instance(mockClientRepository));
  });

  it('debería eliminar un cliente correctamente', async () => {
    // Arrange
    const clientId = 'client-1';
    const agent = new Agent('Agent Name', '123123123');
    
    const existingClient = new Client(
      clientId,
      'Client to delete',
      agent,
      true,
      '123456789',
      ClientType.RESIDENTIAL,
      MembershipType.BASIC,
      [],
      new Date().toISOString(),
      new Date().toISOString()
    );
    
    when(mockClientRepository.findById(clientId)).thenResolve(existingClient);
    when(mockClientRepository.delete(clientId)).thenResolve();

    // Act
    await deleteClientUseCase.execute(clientId);

    // Assert
    verify(mockClientRepository.findById(clientId)).once();
    verify(mockClientRepository.delete(clientId)).once();
  });

  it('debería lanzar una excepción si el cliente no existe', async () => {
    // Arrange
    const clientId = 'non-existent-id';
    when(mockClientRepository.findById(clientId)).thenResolve(null);

    // Act & Assert
    let errorMessage = '';
    let exceptionThrown = false;

    try {
      await deleteClientUseCase.execute(clientId);
    } catch (error) {
      exceptionThrown = true;
      if (error instanceof Error) {
        errorMessage = error.message;
      }
    }
    
    expect(exceptionThrown).toBe(true);
    expect(errorMessage.includes(clientId)).toBe(true);
    verify(mockClientRepository.findById(clientId)).once();
    verify(mockClientRepository.delete(clientId)).never();
  });
}); 