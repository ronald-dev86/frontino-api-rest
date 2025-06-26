import { FirestoreClientRepository } from '../../../../src/clients/infrastructure/repositories/firestore-client.repository';
import { Client } from '../../../../src/clients/domain/entities/client.entity';
import { ClientType } from '../../../../src/clients/domain/enums/client-type.enum';
import { MembershipType } from '../../../../src/clients/domain/enums/membership-type.enum';
import { FirestoreClientAdapter } from '../../../../src/clients/infrastructure/adapters/firestore-client.adapter';
import { ClientNotFoundException } from '../../../../src/clients/domain/exceptions/client-not-found.exception';
import { mock, instance, when, verify, anything, spy, reset } from 'ts-mockito';
import { Agent } from '../../../../src/clients/domain/entities/agent.entity';
import * as firebaseConfig from '../../../../src/config/firebase-config';

// Mock de Firebase
const mockGetFirestore = jest.fn();
const mockInitializeFirebase = jest.fn();

jest.mock('../../../../src/config/firebase-config', () => ({
  getFirestore: () => mockGetFirestore(),
  initializeFirebase: () => mockInitializeFirebase()
}));

describe('FirestoreClientRepository', () => {
  let repository: FirestoreClientRepository;
  let mockFirestore: any;
  let mockCollection: any;
  let mockDocRef: any;
  let mockQuerySnapshot: any;
  let mockDocSnapshot: any;

  let testClient: Client;
  
  // Configurar datos de prueba
  const clientId = 'test-id';
  const agent = new Agent('Agent Name', '123123123');
  const firestoreData = {
    name: 'Test Client',
    agent: { name: 'Agent Name', contactNumber: '123123123' },
    active: true,
    phone: '123456789',
    type: ClientType.RESIDENTIAL,
    membership: MembershipType.BASIC,
    gasCylinders: [],
    createdAt: '2023-01-01T00:00:00.000Z',
    updatedAt: '2023-01-01T00:00:00.000Z'
  };

  beforeEach(() => {
    // Crear mocks para Firestore
    mockDocSnapshot = {
      id: clientId,
      data: jest.fn().mockReturnValue(firestoreData),
      exists: true
    };
    
    mockQuerySnapshot = {
      empty: false,
      docs: [mockDocSnapshot]
    };
    
    mockDocRef = {
      get: jest.fn().mockResolvedValue(mockDocSnapshot),
      set: jest.fn().mockResolvedValue(undefined),
      update: jest.fn().mockResolvedValue(undefined),
      delete: jest.fn().mockResolvedValue(undefined)
    };
    
    mockCollection = {
      doc: jest.fn().mockReturnValue(mockDocRef),
      get: jest.fn().mockResolvedValue(mockQuerySnapshot)
    };
    
    mockFirestore = {
      collection: jest.fn().mockReturnValue(mockCollection)
    };
    
    // Mock para las funciones de Firebase
    mockGetFirestore.mockReturnValue(mockFirestore);
    
    // Crear el repositorio y espiar sus métodos
    repository = new FirestoreClientRepository();

    // Inicializar el repositorio manualmente (ya que no podemos esperar a OnModuleInit)
    repository['firestore'] = mockFirestore;
    
    // Crear cliente de prueba
    testClient = new Client(
      clientId,
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
    
    // Espiar el adaptador estático
    jest.spyOn(FirestoreClientAdapter, 'toClient').mockReturnValue(testClient);
    jest.spyOn(FirestoreClientAdapter, 'toFirestoreData').mockReturnValue(firestoreData);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('findAll', () => {
    it('debería devolver todos los clientes', async () => {
      // Arrange - ya configurado en beforeEach
      
      // Act
      const result = await repository.findAll();
      
      // Assert
      expect(result).toEqual([testClient]);
      expect(mockFirestore.collection).toHaveBeenCalledWith('clients');
      expect(mockCollection.get).toHaveBeenCalled();
      expect(FirestoreClientAdapter.toClient).toHaveBeenCalledWith(clientId, firestoreData);
    });
    
    it('debería devolver un array vacío cuando no hay clientes', async () => {
      // Arrange
      mockQuerySnapshot.empty = true;
      mockQuerySnapshot.docs = [];
      mockCollection.get.mockResolvedValue(mockQuerySnapshot);
      
      // Act
      const result = await repository.findAll();
      
      // Assert
      expect(result).toEqual([]);
      expect(mockFirestore.collection).toHaveBeenCalledWith('clients');
      expect(mockCollection.get).toHaveBeenCalled();
    });
  });
  
  describe('findById', () => {
    it('debería encontrar un cliente por ID', async () => {
      // Arrange - ya configurado en beforeEach
      
      // Act
      const result = await repository.findById(clientId);
      
      // Assert
      expect(result).toEqual(testClient);
      expect(mockFirestore.collection).toHaveBeenCalledWith('clients');
      expect(mockCollection.doc).toHaveBeenCalledWith(clientId);
      expect(mockDocRef.get).toHaveBeenCalled();
      expect(FirestoreClientAdapter.toClient).toHaveBeenCalledWith(clientId, firestoreData);
    });
    
    it('debería devolver null cuando el cliente no existe', async () => {
      // Arrange
      mockDocSnapshot.exists = false;
      mockDocRef.get.mockResolvedValue(mockDocSnapshot);
      
      // Act
      const result = await repository.findById('non-existing-id');
      
      // Assert
      expect(result).toBeNull();
      expect(mockFirestore.collection).toHaveBeenCalledWith('clients');
      expect(mockCollection.doc).toHaveBeenCalledWith('non-existing-id');
      expect(mockDocRef.get).toHaveBeenCalled();
    });
  });
  
  describe('save', () => {
    it('debería guardar un cliente correctamente', async () => {
      // Arrange - ya configurado en beforeEach
      
      // Act
      const result = await repository.save(testClient);
      
      // Assert
      expect(result).toEqual(testClient);
      expect(FirestoreClientAdapter.toFirestoreData).toHaveBeenCalledWith(testClient);
      expect(mockFirestore.collection).toHaveBeenCalledWith('clients');
      expect(mockCollection.doc).toHaveBeenCalledWith(clientId);
      expect(mockDocRef.set).toHaveBeenCalledWith(firestoreData);
    });
  });
  
  describe('update', () => {
    it('debería actualizar un cliente existente', async () => {
      // Arrange
      // Mock para findById dentro del update
      jest.spyOn(repository, 'findById').mockResolvedValue(testClient);
      
      // Act
      const result = await repository.update(testClient);
      
      // Assert
      expect(result).toEqual(testClient);
      expect(repository.findById).toHaveBeenCalledWith(clientId);
      expect(FirestoreClientAdapter.toFirestoreData).toHaveBeenCalledWith(testClient);
      expect(mockFirestore.collection).toHaveBeenCalledWith('clients');
      expect(mockCollection.doc).toHaveBeenCalledWith(clientId);
      expect(mockDocRef.update).toHaveBeenCalledWith(firestoreData);
    });
    
    it('debería lanzar una excepción al actualizar un cliente inexistente', async () => {
      // Arrange
      // Mock para findById dentro del update
      jest.spyOn(repository, 'findById').mockResolvedValue(null);
      
      // Act & Assert
      await expect(repository.update(testClient))
        .rejects.toThrow(ClientNotFoundException);
      
      expect(repository.findById).toHaveBeenCalledWith(clientId);
      expect(mockDocRef.update).not.toHaveBeenCalled();
    });
  });
  
  describe('delete', () => {
    it('debería eliminar un cliente existente', async () => {
      // Arrange
      // Mock para findById dentro del delete
      jest.spyOn(repository, 'findById').mockResolvedValue(testClient);
      
      // Act
      await repository.delete(clientId);
      
      // Assert
      expect(repository.findById).toHaveBeenCalledWith(clientId);
      expect(mockFirestore.collection).toHaveBeenCalledWith('clients');
      expect(mockCollection.doc).toHaveBeenCalledWith(clientId);
      expect(mockDocRef.delete).toHaveBeenCalled();
    });
    
    it('debería lanzar una excepción al eliminar un cliente inexistente', async () => {
      // Arrange
      // Mock para findById dentro del delete
      jest.spyOn(repository, 'findById').mockResolvedValue(null);
      
      // Act & Assert
      await expect(repository.delete('non-existing-id'))
        .rejects.toThrow(ClientNotFoundException);
      
      expect(repository.findById).toHaveBeenCalledWith('non-existing-id');
      expect(mockDocRef.delete).not.toHaveBeenCalled();
    });
  });
}); 