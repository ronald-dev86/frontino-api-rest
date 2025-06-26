import { FirestoreGasBillAdapter } from '../../../../src/gas-bill/infrastructure/adapters/firestore-gas-bill.adapter';
import { GasBill } from '../../../../src/gas-bill/domain/entities/gas-bill.entity';
import { FirebaseDateAdapter } from '../../../../src/shared/infrastructure/adapters/firebase-date.adapter';

jest.mock('../../../../src/shared/infrastructure/adapters/firebase-date.adapter', () => ({
  FirebaseDateAdapter: {
    toDateTimeString: jest.fn().mockImplementation((date) => {
      if (typeof date === 'string') return date;
      return '2023-01-01T00:00:00.000Z';
    })
  }
}));

describe('FirestoreGasBillAdapter', () => {
  const id = 'gasbill-123';

  const firestoreData = {
    idMember: 'member-123',
    time: { _seconds: 1672531200, _nanoseconds: 0 },
    m3: 150,
    urlPhoto: 'https://example.com/photo.jpg',
    createdAt: { _seconds: 1672531200, _nanoseconds: 0 },
    updatedAt: { _seconds: 1672531200, _nanoseconds: 0 }
  };

  const gasBill = new GasBill(
    id,
    firestoreData.idMember,
    '2023-01-01T00:00:00.000Z',
    firestoreData.m3,
    firestoreData.urlPhoto,
    '2023-01-01T00:00:00.000Z',
    '2023-01-01T00:00:00.000Z'
  );

  it('toGasBill debería convertir datos de Firestore a entidad', () => {
    const result = FirestoreGasBillAdapter.toGasBill(id, firestoreData);

    expect(result).toBeInstanceOf(GasBill);
    expect(result.id).toBe(id);
    expect(result.idMember).toBe(firestoreData.idMember);
    expect(result.time).toBe('2023-01-01T00:00:00.000Z');
    expect(result.m3).toBe(firestoreData.m3);
    expect(result.urlPhoto).toBe(firestoreData.urlPhoto);
    expect(FirebaseDateAdapter.toDateTimeString).toHaveBeenCalledTimes(3);
  });

  it('toFirestoreData debería convertir entidad a datos Firestore', () => {
    const result = FirestoreGasBillAdapter.toFirestoreData(gasBill);

    expect(result).toEqual({
      idMember: gasBill.idMember,
      time: gasBill.time,
      m3: gasBill.m3,
      urlPhoto: gasBill.urlPhoto,
      createdAt: gasBill.createdAt,
      updatedAt: gasBill.updatedAt
    });
  });
}); 