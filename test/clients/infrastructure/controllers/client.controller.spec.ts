import { ClientController } from '../../../../src/clients/infrastructure/controllers/client.controller';
import { CreateClientUseCase } from '../../../../src/clients/application/use-cases/create-client.use-case';
import { GetAllClientsUseCase } from '../../../../src/clients/application/use-cases/get-all-clients.use-case';
import { GetClientByIdUseCase } from '../../../../src/clients/application/use-cases/get-client-by-id.use-case';
import { UpdateClientUseCase } from '../../../../src/clients/application/use-cases/update-client.use-case';
import { DeleteClientUseCase } from '../../../../src/clients/application/use-cases/delete-client.use-case';
import { CreateClientDto } from '../../../../src/clients/application/dtos/create-client.dto';
import { UpdateClientDto } from '../../../../src/clients/application/dtos/update-client.dto';
import { Client } from '../../../../src/clients/domain/entities/client.entity';
import { ClientType } from '../../../../src/clients/domain/enums/client-type.enum';
import { MembershipType } from '../../../../src/clients/domain/enums/membership-type.enum';
import { mock, instance, when, verify, anything } from 'ts-mockito';
import { Agent } from '../../../../src/clients/domain/entities/agent.entity';

describe('ClientController', () => {
  let clientController: ClientController;
  let mockCreateClientUseCase: CreateClientUseCase;
  let mockGetAllClientsUseCase: GetAllClientsUseCase;
  let mockGetClientByIdUseCase: GetClientByIdUseCase;
  let mockUpdateClientUseCase: UpdateClientUseCase;
  let mockDeleteClientUseCase: DeleteClientUseCase;

  beforeEach(() => {
    // Crear mocks para los casos de uso
    mockCreateClientUseCase = mock<CreateClientUseCase>();
    mockGetAllClientsUseCase = mock<GetAllClientsUseCase>();
    mockGetClientByIdUseCase = mock<GetClientByIdUseCase>();
    mockUpdateClientUseCase = mock<UpdateClientUseCase>();
    mockDeleteClientUseCase = mock<DeleteClientUseCase>();

    // Instanciar el controlador directamente con los mocks
    clientController = new ClientController(
      instance(mockCreateClientUseCase),
      instance(mockGetAllClientsUseCase),
      instance(mockGetClientByIdUseCase),
      instance(mockUpdateClientUseCase),
      instance(mockDeleteClientUseCase)
    );
  });

  describe('create', () => {
    it('debería crear un nuevo cliente', async () => {
      // Arrange
      const createClientDto: CreateClientDto = {
        name: 'Test Client',
        agent: {
          name: 'Agent Test',
          contactNumber: '123123123'
        },
        active: true,
        phone: '123456789',
        type: ClientType.RESIDENTIAL,
        membership: MembershipType.BASIC
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

      // Configurar el mock para que devuelva el cliente esperado
      when(mockCreateClientUseCase.execute(anything())).thenResolve(expectedClient);

      // Act
      const result = await clientController.create(createClientDto);

      // Assert
      expect(result.data).toEqual(expectedClient);
      expect(result.status).toEqual(201);
      verify(mockCreateClientUseCase.execute(createClientDto)).once();
    });
  });

  describe('findAll', () => {
    it('debería devolver una lista de clientes', async () => {
      // Arrange
      const agent1 = new Agent(
        'Agent 1',
        '123123123'
      );
      
      const agent2 = new Agent(
        'Agent 2',
        '456456456'
      );

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

      when(mockGetAllClientsUseCase.execute()).thenResolve(expectedClients);

      // Act
      const result = await clientController.findAll();

      // Assert
      expect(result.data).toEqual(expectedClients);
      expect(result.status).toEqual(200);
      verify(mockGetAllClientsUseCase.execute()).once();
    });
  });

  describe('findOne', () => {
    it('debería devolver un cliente por ID', async () => {
      // Arrange
      const clientId = 'client-1';
      const agent = new Agent(
        'Agent 1',
        '123123123'
      );

      const expectedClient = new Client(
        clientId,
        'Client 1',
        agent,
        true,
        '123456789',
        ClientType.RESIDENTIAL,
        MembershipType.BASIC,
        [],
        new Date().toISOString(),
        new Date().toISOString(),
      );

      when(mockGetClientByIdUseCase.execute(clientId)).thenResolve(expectedClient);

      // Act
      const result = await clientController.findOne(clientId);

      // Assert
      expect(result.data).toEqual(expectedClient);
      expect(result.status).toEqual(200);
      verify(mockGetClientByIdUseCase.execute(clientId)).once();
    });
  });
  
  describe('update', () => {
    it('debería actualizar un cliente existente', async () => {
      // Arrange
      const clientId = 'client-1';
      const updateClientDto: UpdateClientDto = {
        name: 'Updated Client',
        type: ClientType.COMMERCIAL
      };
      
      const agent = new Agent('Agent Name', '123123123');
      
      const updatedClient = new Client(
        clientId,
        updateClientDto.name!,
        agent,
        true,
        '123456789',
        updateClientDto.type!,
        MembershipType.BASIC,
        [],
        new Date().toISOString(),
        new Date().toISOString()
      );
      
      when(mockUpdateClientUseCase.execute(clientId, updateClientDto)).thenResolve(updatedClient);
      
      // Act
      const result = await clientController.update(clientId, updateClientDto);
      
      // Assert
      expect(result.data).toEqual(updatedClient);
      expect(result.status).toEqual(200);
      verify(mockUpdateClientUseCase.execute(clientId, updateClientDto)).once();
    });
  });
  
  describe('remove', () => {
    it('debería eliminar un cliente existente', async () => {
      // Arrange
      const clientId = 'client-1';
      when(mockDeleteClientUseCase.execute(clientId)).thenResolve();
      
      // Act
      const result = await clientController.remove(clientId);
      
      // Assert
      expect(result.data).toBe(null);
      expect(result.status).toEqual(200);
      verify(mockDeleteClientUseCase.execute(clientId)).once();
    });
  });
}); 