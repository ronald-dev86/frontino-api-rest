import { FirestoreGasBillRepository } from '../../../../src/gas-bill/infrastructure/repositories/firestore-gas-bill.repository';
import { GasBill } from '../../../../src/gas-bill/domain/entities/gas-bill.entity';
import { FirestoreGasBillAdapter } from '../../../../src/gas-bill/infrastructure/adapters/firestore-gas-bill.adapter';
import { GasBillNotFoundException } from '../../../../src/gas-bill/domain/exceptions/gas-bill-not-found.exception';
import * as firebaseConfig from '../../../../src/config/firebase-config';

// Mock de Firebase
const mockGetFirestore = jest.fn();
const mockInitializeFirebase = jest.fn();

jest.mock('../../../../src/config/firebase-config', () => ({
  getFirestore: () => mockGetFirestore(),
  initializeFirebase: () => mockInitializeFirebase()
}));

describe('FirestoreGasBillRepository', () => {
  let repository: FirestoreGasBillRepository;
  let mockFirestore: any;
  let mockCollection: any;
  let mockDocRef: any;
  let mockQuerySnapshot: any;
  let mockDocSnapshot: any;
  let mockWhereQuery: any;

  const billId = 'bill-123';
  const idMember = 'member-456';
  const time = '2023-01-01T00:00:00.000Z';

  let firestoreData: any;
  let gasBill: GasBill;

  beforeEach(() => {
    firestoreData = {
      idMember,
      time,
      m3: 150,
      urlPhoto: 'url',
      createdAt: time,
      updatedAt: time
    };

    gasBill = new GasBill(billId, idMember, time, 150, 'url', time, time);

    mockDocSnapshot = {
      id: billId,
      data: jest.fn().mockReturnValue(firestoreData),
      exists: true
    };

    mockQuerySnapshot = {
      empty: false,
      docs: [mockDocSnapshot]
    };

    mockWhereQuery = {
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
      where: jest.fn().mockReturnValue(mockWhereQuery)
    };

    mockFirestore = {
      collection: jest.fn().mockReturnValue(mockCollection)
    };

    mockGetFirestore.mockReturnValue(mockFirestore);

    repository = new FirestoreGasBillRepository();
    repository['firestore'] = mockFirestore;

    jest.spyOn(FirestoreGasBillAdapter, 'toGasBill').mockReturnValue(gasBill);
    jest.spyOn(FirestoreGasBillAdapter, 'toFirestoreData').mockReturnValue(firestoreData);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('save', () => {
    it('debería guardar una factura', async () => {
      const result = await repository.save(gasBill);
      expect(result).toEqual(gasBill);
      expect(mockFirestore.collection).toHaveBeenCalledWith('gas-bills');
      expect(mockCollection.doc).toHaveBeenCalledWith(billId);
      expect(mockDocRef.set).toHaveBeenCalledWith(firestoreData);
    });
  });

  describe('findAll', () => {
    it('debería devolver todas las facturas', async () => {
      const result = await repository.findAll();
      expect(result).toEqual([gasBill]);
      expect(mockCollection.get).toHaveBeenCalled();
    });

    it('debería devolver array vacío cuando no hay facturas', async () => {
      mockQuerySnapshot.empty = true;
      mockQuerySnapshot.docs = [];
      mockCollection.get.mockResolvedValue(mockQuerySnapshot);

      const result = await repository.findAll();
      expect(result).toEqual([]);
    });
  });

  describe('findById', () => {
    it('debería encontrar por ID', async () => {
      const result = await repository.findById(billId);
      expect(result).toEqual(gasBill);
    });

    it('debería devolver null si no existe', async () => {
      mockDocSnapshot.exists = false;
      const result = await repository.findById('non');
      expect(result).toBeNull();
    });
  });

  describe('findByTimeAndMember', () => {
    it('debería devolver la factura correcta', async () => {
      const result = await repository.findByTimeAndMember(time, idMember);
      expect(result).toEqual(gasBill);
      expect(mockCollection.where).toHaveBeenCalledWith('time', '==', time);
      expect(mockWhereQuery.where).toHaveBeenCalledWith('idMember', '==', idMember);
    });

    it('debería devolver null cuando no existe', async () => {
      mockQuerySnapshot.empty = true;
      mockWhereQuery.get.mockResolvedValue(mockQuerySnapshot);
      const result = await repository.findByTimeAndMember(time, idMember);
      expect(result).toBeNull();
    });
  });

  describe('findInIdsMembers', () => {
    it('debería devolver facturas para los miembros', async () => {
      const result = await repository.findInIdsMembers([idMember]);
      expect(result).toEqual([gasBill]);
      expect(mockCollection.where).toHaveBeenCalledWith('idMember', 'in', [idMember]);
    });

    it('debería devolver vacío si no hay facturas', async () => {
      mockQuerySnapshot.empty = true;
      mockQuerySnapshot.docs = [];
      mockWhereQuery.get.mockResolvedValue(mockQuerySnapshot);
      const result = await repository.findInIdsMembers([idMember]);
      expect(result).toEqual([]);
    });
  });

  describe('update', () => {
    it('debería actualizar', async () => {
      jest.spyOn(repository, 'findById').mockResolvedValue(gasBill);
      const result = await repository.update(billId, { m3: 200 });
      expect(result).toEqual(gasBill);
      expect(mockDocRef.update).toHaveBeenCalledWith(expect.objectContaining({ m3: 200, updatedAt: expect.any(String) }));
    });

    it('debería lanzar excepción si no existe', async () => {
      jest.spyOn(repository, 'findById').mockResolvedValue(null);
      await expect(repository.update('non', { m3: 100 })).rejects.toThrow(GasBillNotFoundException);
    });
  });

  describe('delete', () => {
    it('debería eliminar', async () => {
      jest.spyOn(repository, 'findById').mockResolvedValue(gasBill);
      await repository.delete(billId);
      expect(mockDocRef.delete).toHaveBeenCalled();
    });

    it('debería lanzar excepción si no existe', async () => {
      jest.spyOn(repository, 'findById').mockResolvedValue(null);
      await expect(repository.delete('non')).rejects.toThrow(GasBillNotFoundException);
    });
  });
}); 