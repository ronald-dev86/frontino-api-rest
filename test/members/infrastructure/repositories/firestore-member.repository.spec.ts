import { FirestoreMemberRepository } from '../../../../src/members/infrastructure/repositories/firestore-member.repository';
import { Member } from '../../../../src/members/domain/entities/member.entity';
import { FirestoreMemberAdapter } from '../../../../src/members/infrastructure/adapters/firestore-member.adapter';
import { MemberNotFoundException } from '../../../../src/members/domain/exceptions/member-not-found.exception';
import { mock, instance, when, verify, anything } from 'ts-mockito';
import * as firebaseConfig from '../../../../src/config/firebase-config';

// Mock de Firebase
const mockGetFirestore = jest.fn();
const mockInitializeFirebase = jest.fn();

jest.mock('../../../../src/config/firebase-config', () => ({
  getFirestore: () => mockGetFirestore(),
  initializeFirebase: () => mockInitializeFirebase()
}));

describe('FirestoreMemberRepository', () => {
  let repository: FirestoreMemberRepository;
  let mockFirestore: any;
  let mockCollection: any;
  let mockDocRef: any;
  let mockQuerySnapshot: any;
  let mockDocSnapshot: any;
  let mockQueryDocSnapshot: any;
  let mockQuery: any;

  // Configurar datos de prueba
  const memberId = 'c7d3915b-4b9a-4ce5-8bac-ed320ba21fa5';
  const clientId = 'c2876d83-fe08-4779-9da4-75eb868358c0';
  const meterSerial = 'MS001';
  
  let testMember: Member;
  let firestoreData: any;

  beforeEach(() => {
    // Crear datos de prueba
    testMember = new Member(
      memberId,
      clientId,
      'John',
      'Doe',
      'john@example.com',
      '123456789',
      '123 Main St',
      meterSerial,
      true,
      '2023-01-01T00:00:00.000Z',
      '2023-01-01T00:00:00.000Z'
    );

    firestoreData = {
      idClient: clientId,
      name: 'John',
      lastname: 'Doe',
      email: 'john@example.com',
      phone: '123456789',
      address: '123 Main St',
      meterSerial: meterSerial,
      active: true,
      createdAt: '2023-01-01T00:00:00.000Z',
      updatedAt: '2023-01-01T00:00:00.000Z'
    };

    // Crear mocks para Firestore
    mockDocSnapshot = {
      id: memberId,
      data: jest.fn().mockReturnValue(firestoreData),
      exists: true
    };

    mockQueryDocSnapshot = {
      id: memberId,
      data: jest.fn().mockReturnValue(firestoreData),
      exists: true
    };
    
    mockQuerySnapshot = {
      empty: false,
      docs: [mockQueryDocSnapshot]
    };
    
    mockQuery = {
      where: jest.fn().mockReturnThis(),
      limit: jest.fn().mockReturnThis(),
      get: jest.fn().mockResolvedValue(mockQuerySnapshot)
    };
    
    mockDocRef = {
      get: jest.fn().mockResolvedValue(mockDocSnapshot),
      set: jest.fn().mockResolvedValue(undefined),
      update: jest.fn().mockResolvedValue(undefined),
      delete: jest.fn().mockResolvedValue(undefined)
    };
    
    mockCollection = {
      doc: jest.fn().mockReturnValue(mockDocRef),
      get: jest.fn().mockResolvedValue(mockQuerySnapshot),
      where: jest.fn().mockReturnValue(mockQuery)
    };
    
    mockFirestore = {
      collection: jest.fn().mockReturnValue(mockCollection)
    };
    
    // Mock para las funciones de Firebase
    mockGetFirestore.mockReturnValue(mockFirestore);
    
    // Crear el repositorio
    repository = new FirestoreMemberRepository();

    // Inicializar el repositorio manualmente (ya que no podemos esperar a OnModuleInit)
    repository['firestore'] = mockFirestore;
    
    // Espiar el adaptador estático
    jest.spyOn(FirestoreMemberAdapter, 'toMember').mockReturnValue(testMember);
    jest.spyOn(FirestoreMemberAdapter, 'toFirestoreData').mockReturnValue(firestoreData);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('debería crear un miembro correctamente', async () => {
      // Act
      const result = await repository.create(testMember);
      
      // Assert
      expect(result).toEqual(testMember);
      expect(FirestoreMemberAdapter.toFirestoreData).toHaveBeenCalledWith(testMember);
      expect(mockFirestore.collection).toHaveBeenCalledWith('members');
      expect(mockCollection.doc).toHaveBeenCalledWith(memberId);
      expect(mockDocRef.set).toHaveBeenCalledWith(firestoreData);
    });

    it('debería propagar errores cuando falla la creación', async () => {
      // Arrange
      const error = new Error('Error al crear miembro');
      mockDocRef.set.mockRejectedValue(error);

      // Act & Assert
      await expect(repository.create(testMember)).rejects.toThrow(error);
      expect(FirestoreMemberAdapter.toFirestoreData).toHaveBeenCalledWith(testMember);
      expect(mockFirestore.collection).toHaveBeenCalledWith('members');
    });
  });

  describe('findAll', () => {
    it('debería devolver todos los miembros', async () => {
      // Act
      const result = await repository.findAll();
      
      // Assert
      expect(result).toEqual([testMember]);
      expect(mockFirestore.collection).toHaveBeenCalledWith('members');
      expect(mockCollection.get).toHaveBeenCalled();
      expect(FirestoreMemberAdapter.toMember).toHaveBeenCalledWith(memberId, firestoreData);
    });
    
    it('debería devolver un array vacío cuando no hay miembros', async () => {
      // Arrange
      mockQuerySnapshot.empty = true;
      mockQuerySnapshot.docs = [];
      mockCollection.get.mockResolvedValue(mockQuerySnapshot);
      
      // Act
      const result = await repository.findAll();
      
      // Assert
      expect(result).toEqual([]);
      expect(mockFirestore.collection).toHaveBeenCalledWith('members');
      expect(mockCollection.get).toHaveBeenCalled();
    });
  });
  
  describe('findById', () => {
    it('debería encontrar un miembro por ID', async () => {
      // Act
      const result = await repository.findById(memberId);
      
      // Assert
      expect(result).toEqual(testMember);
      expect(mockFirestore.collection).toHaveBeenCalledWith('members');
      expect(mockCollection.doc).toHaveBeenCalledWith(memberId);
      expect(mockDocRef.get).toHaveBeenCalled();
      expect(FirestoreMemberAdapter.toMember).toHaveBeenCalledWith(memberId, firestoreData);
    });
    
    it('debería devolver null cuando el miembro no existe', async () => {
      // Arrange
      mockDocSnapshot.exists = false;
      mockDocRef.get.mockResolvedValue(mockDocSnapshot);
      
      // Act
      const result = await repository.findById('non-existing-id');
      
      // Assert
      expect(result).toBeNull();
      expect(mockFirestore.collection).toHaveBeenCalledWith('members');
      expect(mockCollection.doc).toHaveBeenCalledWith('non-existing-id');
      expect(mockDocRef.get).toHaveBeenCalled();
    });
  });

  describe('findByMeterSerial', () => {
    it('debería encontrar un miembro por número de serie del medidor', async () => {
      // Act
      const result = await repository.findByMeterSerial(meterSerial);
      
      // Assert
      expect(result).toEqual(testMember);
      expect(mockFirestore.collection).toHaveBeenCalledWith('members');
      expect(mockCollection.where).toHaveBeenCalledWith('meterSerial', '==', meterSerial);
      expect(mockQuery.limit).toHaveBeenCalledWith(1);
      expect(mockQuery.get).toHaveBeenCalled();
      expect(FirestoreMemberAdapter.toMember).toHaveBeenCalledWith(memberId, firestoreData);
    });
    
    it('debería devolver null cuando no hay miembro con ese número de serie', async () => {
      // Arrange
      mockQuerySnapshot.empty = true;
      mockQuerySnapshot.docs = [];
      mockQuery.get.mockResolvedValue(mockQuerySnapshot);
      
      // Act
      const result = await repository.findByMeterSerial('non-existing-serial');
      
      // Assert
      expect(result).toBeNull();
      expect(mockFirestore.collection).toHaveBeenCalledWith('members');
      expect(mockCollection.where).toHaveBeenCalledWith('meterSerial', '==', 'non-existing-serial');
      expect(mockQuery.limit).toHaveBeenCalledWith(1);
      expect(mockQuery.get).toHaveBeenCalled();
    });
  });

  describe('findAllByClientId', () => {
    it('debería encontrar miembros por ID de cliente', async () => {
      // Act
      const result = await repository.findAllByClientId(clientId);
      
      // Assert
      expect(result).toEqual([testMember]);
      expect(mockFirestore.collection).toHaveBeenCalledWith('members');
      expect(mockCollection.where).toHaveBeenCalledWith('idClient', '==', clientId);
      expect(mockQuery.get).toHaveBeenCalled();
      expect(FirestoreMemberAdapter.toMember).toHaveBeenCalledWith(memberId, firestoreData);
    });
    
    it('debería devolver array vacío cuando no hay miembros para ese cliente', async () => {
      // Arrange
      mockQuerySnapshot.empty = true;
      mockQuerySnapshot.docs = [];
      mockQuery.get.mockResolvedValue(mockQuerySnapshot);
      
      // Act
      const result = await repository.findAllByClientId('non-existing-client');
      
      // Assert
      expect(result).toEqual([]);
      expect(mockFirestore.collection).toHaveBeenCalledWith('members');
      expect(mockCollection.where).toHaveBeenCalledWith('idClient', '==', 'non-existing-client');
      expect(mockQuery.get).toHaveBeenCalled();
    });
  });
  
  describe('update', () => {
    it('debería actualizar un miembro existente', async () => {
      // Arrange
      const memberToUpdate = { name: 'Updated Name', phone: '987654321' };
      
      // Mock para findById
      jest.spyOn(repository, 'findById')
        .mockImplementation(async (id) => id === memberId ? testMember : null);
      
      // Act
      const result = await repository.update(memberId, memberToUpdate);
      
      // Assert
      expect(result).toEqual(testMember);
      expect(repository.findById).toHaveBeenCalledWith(memberId);
      expect(mockFirestore.collection).toHaveBeenCalledWith('members');
      expect(mockCollection.doc).toHaveBeenCalledWith(memberId);
      
      // Verificar que se actualizaron los datos correctos
      expect(mockDocRef.update).toHaveBeenCalledWith(expect.objectContaining({
        name: 'Updated Name',
        phone: '987654321',
        updatedAt: expect.any(String)
      }));
    });
    
    it('debería lanzar MemberNotFoundException al actualizar un miembro inexistente', async () => {
      // Arrange
      const memberToUpdate = { name: 'Updated Name' };
      
      // Mock para findById
      jest.spyOn(repository, 'findById').mockResolvedValue(null);
      
      // Act & Assert
      await expect(repository.update('non-existing-id', memberToUpdate))
        .rejects.toThrow(MemberNotFoundException);
      
      expect(repository.findById).toHaveBeenCalledWith('non-existing-id');
      expect(mockDocRef.update).not.toHaveBeenCalled();
    });
  });
  
  describe('delete', () => {
    it('debería eliminar un miembro existente', async () => {
      // Arrange
      // Mock para findById
      jest.spyOn(repository, 'findById')
        .mockImplementation(async (id) => id === memberId ? testMember : null);
      
      // Act
      await repository.delete(memberId);
      
      // Assert
      expect(repository.findById).toHaveBeenCalledWith(memberId);
      expect(mockFirestore.collection).toHaveBeenCalledWith('members');
      expect(mockCollection.doc).toHaveBeenCalledWith(memberId);
      expect(mockDocRef.delete).toHaveBeenCalled();
    });
    
    it('debería lanzar MemberNotFoundException al eliminar un miembro inexistente', async () => {
      // Arrange
      // Mock para findById
      jest.spyOn(repository, 'findById').mockResolvedValue(null);
      
      // Act & Assert
      await expect(repository.delete('non-existing-id'))
        .rejects.toThrow(MemberNotFoundException);
      
      expect(repository.findById).toHaveBeenCalledWith('non-existing-id');
      expect(mockDocRef.delete).not.toHaveBeenCalled();
    });
  });
}); 