import { UpdateClientUseCase } from '../../../../src/clients/application/use-cases/update-client.use-case';
import { ClientRepository } from '../../../../src/clients/application/ports/client.repository';
import { Client } from '../../../../src/clients/domain/entities/client.entity';
import { ClientType } from '../../../../src/clients/domain/enums/client-type.enum';
import { MembershipType } from '../../../../src/clients/domain/enums/membership-type.enum';
import { mock, instance, when, verify, anything } from 'ts-mockito';
import { Agent } from '../../../../src/clients/domain/entities/agent.entity';
import { ClientNotFoundException } from '../../../../src/clients/domain/exceptions/client-not-found.exception';
import { UpdateClientDto } from '../../../../src/clients/application/dtos/update-client.dto';

describe('UpdateClientUseCase', () => {
  let updateClientUseCase: UpdateClientUseCase;
  let mockClientRepository: ClientRepository;

  beforeEach(() => {
    // Crear mock del repositorio
    mockClientRepository = mock<ClientRepository>();
    // Instanciar el caso de uso directamente
    updateClientUseCase = new UpdateClientUseCase(instance(mockClientRepository));
  });

  it('debería actualizar un cliente correctamente', async () => {
    // Arrange
    const clientId = 'client-1';
    const agent = new Agent('Agent Name', '123123123');
    const updatedAgent = new Agent('Updated Agent', '987654321');
    
    // Cliente existente
    const existingClient = new Client(
      clientId,
      'Original Client',
      agent,
      true,
      '123456789',
      ClientType.RESIDENTIAL,
      MembershipType.BASIC,
      [],
      new Date().toISOString(),
      new Date().toISOString()
    );
    
    // DTO con datos para actualizar
    const updateClientDto: UpdateClientDto = {
      name: 'Updated Client',
      agent: {
        name: 'Updated Agent',
        contactNumber: '987654321'
      },
      type: ClientType.COMMERCIAL,
      membership: MembershipType.PREMIUM
    };
    
    // Cliente actualizado esperado
    const expectedClient = new Client(
      clientId,
      updateClientDto.name!,
      updatedAgent,
      existingClient.active,
      existingClient.phone,
      updateClientDto.type!,
      updateClientDto.membership!,
      [],
      existingClient.createdAt,
      new Date().toISOString()
    );

    when(mockClientRepository.findById(clientId)).thenResolve(existingClient);
    when(mockClientRepository.update(anything())).thenResolve(expectedClient);

    // Act
    const result = await updateClientUseCase.execute(clientId, updateClientDto);

    // Assert
    expect(result).toEqual(expectedClient);
    expect(result.name).toEqual(updateClientDto.name);
    expect(result.type).toEqual(updateClientDto.type);
    expect(result.membership).toEqual(updateClientDto.membership);
    verify(mockClientRepository.findById(clientId)).once();
    verify(mockClientRepository.update(anything())).once();
  });

  it('debería lanzar una excepción si el cliente no existe', async () => {
    // Arrange
    const clientId = 'non-existent-id';
    const updateClientDto: UpdateClientDto = {
      name: 'Updated Client'
    };
    
    when(mockClientRepository.findById(clientId)).thenResolve(null);

    // Act & Assert
    let errorMessage = '';
    let exceptionThrown = false;

    try {
      await updateClientUseCase.execute(clientId, updateClientDto);
    } catch (error) {
      exceptionThrown = true;
      if (error instanceof Error) {
        errorMessage = error.message;
      }
    }
    
    expect(exceptionThrown).toBe(true);
    expect(errorMessage.includes(clientId)).toBe(true);
    verify(mockClientRepository.findById(clientId)).once();
    verify(mockClientRepository.update(anything())).never();
  });
}); 