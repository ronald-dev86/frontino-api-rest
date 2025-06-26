import { FirestoreMemberAdapter } from '../../../../src/members/infrastructure/adapters/firestore-member.adapter';
import { Member } from '../../../../src/members/domain/entities/member.entity';
import { FirebaseDateAdapter } from '../../../../src/shared/infrastructure/adapters/firebase-date.adapter';

// Mock FirebaseDateAdapter
jest.mock('../../../../src/shared/infrastructure/adapters/firebase-date.adapter', () => ({
  FirebaseDateAdapter: {
    toDateTimeString: jest.fn().mockImplementation(date => {
      if (typeof date === 'string') return date;
      return '2023-01-01T00:00:00.000Z';
    }),
    toEmailString: jest.fn().mockImplementation(email => {
      if (typeof email === 'string') return email;
      if (email && email._value) return email._value;
      return '';
    })
  }
}));

describe('FirestoreMemberAdapter', () => {
  // Datos de prueba
  const memberId = 'member-123';
  const clientId = 'client-456';
  
  // Miembro de prueba
  let testMember: Member;
  
  // Datos de Firestore simulados
  let firestoreData: any;

  beforeEach(() => {
    // Crear miembro de prueba
    testMember = new Member(
      memberId,
      clientId,
      'John',
      'Doe',
      'john@example.com',
      '123456789',
      '123 Main St',
      'MS001',
      true,
      '2023-01-01T00:00:00.000Z',
      '2023-01-01T00:00:00.000Z'
    );

    // Datos de Firestore simulados
    firestoreData = {
      idClient: clientId,
      name: 'John',
      lastname: 'Doe',
      email: 'john@example.com',
      phone: '123456789',
      address: '123 Main St',
      meterSerial: 'MS001',
      active: true,
      createdAt: {
        _seconds: 1672531200,
        _nanoseconds: 0
      },
      updatedAt: {
        _seconds: 1672531200,
        _nanoseconds: 0
      }
    };
  });

  describe('toMember', () => {
    it('debería convertir datos de Firestore a una entidad Member', () => {
      // Act
      const result = FirestoreMemberAdapter.toMember(memberId, firestoreData);

      // Assert
      expect(result).toBeInstanceOf(Member);
      expect(result.id).toEqual(memberId);
      expect(result.idClient).toEqual(firestoreData.idClient);
      expect(result.name).toEqual(firestoreData.name);
      expect(result.lastname).toEqual(firestoreData.lastname);
      expect(result.email).toEqual(firestoreData.email);
      expect(result.phone).toEqual(firestoreData.phone);
      expect(result.address).toEqual(firestoreData.address);
      expect(result.meterSerial).toEqual(firestoreData.meterSerial);
      expect(result.active).toEqual(firestoreData.active);
      
      // Verificar que se utilizaron los adaptadores para las fechas y el email
      expect(FirebaseDateAdapter.toDateTimeString).toHaveBeenCalledWith(firestoreData.createdAt);
      expect(FirebaseDateAdapter.toDateTimeString).toHaveBeenCalledWith(firestoreData.updatedAt);
      expect(FirebaseDateAdapter.toEmailString).toHaveBeenCalledWith(firestoreData.email);
    });

    it('debería manejar formatos especiales de email', () => {
      // Arrange
      const firestoreDataWithEmailObject = {
        ...firestoreData,
        email: { _value: 'john@example.com' }
      };

      // Act
      const result = FirestoreMemberAdapter.toMember(memberId, firestoreDataWithEmailObject);

      // Assert
      expect(result.email).toEqual('john@example.com');
      expect(FirebaseDateAdapter.toEmailString).toHaveBeenCalledWith(firestoreDataWithEmailObject.email);
    });

    it('debería manejar fechas en diferentes formatos', () => {
      // Arrange
      const firestoreDataWithStringDates = {
        ...firestoreData,
        createdAt: '2023-01-01T00:00:00.000Z',
        updatedAt: '2023-01-01T00:00:00.000Z'
      };

      // Act
      const result = FirestoreMemberAdapter.toMember(memberId, firestoreDataWithStringDates);

      // Assert
      expect(result.createdAt).toEqual('2023-01-01T00:00:00.000Z');
      expect(result.updatedAt).toEqual('2023-01-01T00:00:00.000Z');
      expect(FirebaseDateAdapter.toDateTimeString).toHaveBeenCalledWith(firestoreDataWithStringDates.createdAt);
      expect(FirebaseDateAdapter.toDateTimeString).toHaveBeenCalledWith(firestoreDataWithStringDates.updatedAt);
    });
  });

  describe('toFirestoreData', () => {
    it('debería convertir una entidad Member a formato Firestore', () => {
      // Act
      const result = FirestoreMemberAdapter.toFirestoreData(testMember);

      // Assert
      expect(result).toEqual({
        idClient: testMember.idClient,
        name: testMember.name,
        lastname: testMember.lastname,
        email: testMember.email,
        phone: testMember.phone,
        address: testMember.address,
        meterSerial: testMember.meterSerial,
        active: testMember.active,
        createdAt: testMember.createdAt,
        updatedAt: testMember.updatedAt
      });
    });
  });
}); 