import { InMemoryClientRepository } from '../../../../src/clients/infrastructure/repositories/in-memory-client.repository';
import { Client } from '../../../../src/clients/domain/entities/client.entity';
import { ClientType } from '../../../../src/clients/domain/enums/client-type.enum';
import { MembershipType } from '../../../../src/clients/domain/enums/membership-type.enum';
import { ClientNotFoundException } from '../../../../src/clients/domain/exceptions/client-not-found.exception';
import { Agent } from '../../../../src/clients/domain/entities/agent.entity';

describe('InMemoryClientRepository', () => {
  let repository: InMemoryClientRepository;
  let testClient: Client;

  beforeEach(() => {
    repository = new InMemoryClientRepository();
    
    // Crear un agente para el cliente
    const agent = new Agent('Agent Name', '123456789');
    
    // Crear cliente de prueba con la estructura actual
    testClient = new Client(
      'test-id',
      'Test Client',
      agent,
      true,
      '123456789',
      ClientType.RESIDENTIAL,
      MembershipType.BASIC,
      [],
      '2023-01-01T00:00:00.000Z',
      '2023-01-01T00:00:00.000Z'
    );
  });

  describe('save', () => {
    it('debería guardar un cliente correctamente', async () => {
      // Act
      await repository.save(testClient);
      
      // Assert
      const savedClient = await repository.findById(testClient.id);
      expect(savedClient).toEqual(testClient);
    });
  });

  describe('findById', () => {
    it('debería encontrar un cliente por ID', async () => {
      // Arrange
      await repository.save(testClient);
      
      // Act
      const foundClient = await repository.findById(testClient.id);
      
      // Assert
      expect(foundClient).toEqual(testClient);
    });

    it('debería devolver null cuando el cliente no existe', async () => {
      // Act
      const result = await repository.findById('non-existing-id');
      
      // Assert
      expect(result).toBeNull();
    });
  });

  describe('findAll', () => {
    it('debería devolver todos los clientes', async () => {
      // Arrange
      const anotherAgent = new Agent('Another Agent', '987654321');
      const anotherClient = new Client(
        'another-id',
        'Another Client',
        anotherAgent,
        true,
        '987654321',
        ClientType.COMMERCIAL,
        MembershipType.PREMIUM,
        [],
        '2023-01-01T00:00:00.000Z',
        '2023-01-01T00:00:00.000Z'
      );
      
      await repository.save(testClient);
      await repository.save(anotherClient);
      
      // Act
      const clients = await repository.findAll();
      
      // Assert
      expect(clients).toHaveLength(2);
      expect(clients).toContainEqual(testClient);
      expect(clients).toContainEqual(anotherClient);
    });

    it('debería devolver un array vacío cuando no hay clientes', async () => {
      // Act
      const clients = await repository.findAll();
      
      // Assert
      expect(clients).toEqual([]);
    });
  });

  describe('update', () => {
    it('debería actualizar un cliente existente', async () => {
      // Arrange
      await repository.save(testClient);
      const updatedClient = new Client(
        testClient.id,
        'Updated Client Name',
        testClient.agent,
        testClient.active,
        testClient.phone,
        testClient.type,
        testClient.membership,
        testClient.gasCylinders,
        testClient.createdAt,
        testClient.updatedAt
      );
      
      // Act
      const result = await repository.update(updatedClient);
      
      // Assert
      expect(result).toEqual(updatedClient);
      const storedClient = await repository.findById(testClient.id);
      expect(storedClient).not.toBeNull();
      expect(storedClient!.name).toEqual('Updated Client Name');
    });

    it('debería lanzar una excepción al actualizar un cliente inexistente', async () => {
      // Arrange
      const nonExistingClient = new Client(
        'non-existing-id',
        'Non Existing Client',
        new Agent('Agent Name', '123456789'),
        true,
        '123456789',
        ClientType.RESIDENTIAL,
        MembershipType.BASIC,
        [],
        '2023-01-01T00:00:00.000Z',
        '2023-01-01T00:00:00.000Z'
      );
      
      // Act & Assert
      await expect(repository.update(nonExistingClient)).rejects.toThrow(ClientNotFoundException);
    });
  });

  describe('delete', () => {
    it('debería eliminar un cliente existente', async () => {
      // Arrange
      await repository.save(testClient);
      
      // Act
      await repository.delete(testClient.id);
      
      // Assert
      const result = await repository.findById(testClient.id);
      expect(result).toBeNull();
    });

    it('debería lanzar una excepción al eliminar un cliente inexistente', async () => {
      // Act & Assert
      await expect(repository.delete('non-existing-id')).rejects.toThrow(ClientNotFoundException);
    });
  });
}); 