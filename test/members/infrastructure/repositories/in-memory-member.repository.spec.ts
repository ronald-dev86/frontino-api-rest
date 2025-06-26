import { InMemoryMemberRepository } from '../../../../src/members/infrastructure/repositories/in-memory-member.repository';
import { Member } from '../../../../src/members/domain/entities/member.entity';
import { MemberNotFoundException } from '../../../../src/members/domain/exceptions/member-not-found.exception';

describe('InMemoryMemberRepository', () => {
  let repository: InMemoryMemberRepository;
  let testMember: Member;

  beforeEach(() => {
    repository = new InMemoryMemberRepository();
    
    // Crear miembro de prueba
    testMember = new Member(
      'member-123',
      'client-456',
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
  });

  describe('create', () => {
    it('debería guardar un miembro correctamente', async () => {
      // Act
      await repository.create(testMember);
      
      // Assert
      const savedMember = await repository.findById(testMember.id);
      expect(savedMember).toEqual(testMember);
    });
  });

  describe('findAll', () => {
    it('debería devolver todos los miembros', async () => {
      // Arrange
      const anotherMember = new Member(
        'member-456',
        'client-789',
        'Jane',
        'Smith',
        'jane@example.com',
        '987654321',
        '456 Oak St',
        'MS002',
        true,
        '2023-01-02T00:00:00.000Z',
        '2023-01-02T00:00:00.000Z'
      );
      
      await repository.create(testMember);
      await repository.create(anotherMember);
      
      // Act
      const members = await repository.findAll();
      
      // Assert
      expect(members).toHaveLength(2);
      expect(members).toContainEqual(testMember);
      expect(members).toContainEqual(anotherMember);
    });

    it('debería devolver un array vacío cuando no hay miembros', async () => {
      // Act
      const members = await repository.findAll();
      
      // Assert
      expect(members).toEqual([]);
      expect(members).toHaveLength(0);
    });
  });

  describe('findById', () => {
    it('debería encontrar un miembro por ID', async () => {
      // Arrange
      await repository.create(testMember);
      
      // Act
      const member = await repository.findById(testMember.id);
      
      // Assert
      expect(member).toEqual(testMember);
    });

    it('debería devolver null cuando el miembro no existe', async () => {
      // Act
      const member = await repository.findById('non-existing-id');
      
      // Assert
      expect(member).toBeNull();
    });
  });

  describe('findByMeterSerial', () => {
    it('debería encontrar un miembro por número de serie del medidor', async () => {
      // Arrange
      await repository.create(testMember);
      
      // Act
      const member = await repository.findByMeterSerial(testMember.meterSerial);
      
      // Assert
      expect(member).toEqual(testMember);
    });

    it('debería devolver null cuando no existe un miembro con ese número de serie', async () => {
      // Act
      const member = await repository.findByMeterSerial('non-existing-serial');
      
      // Assert
      expect(member).toBeNull();
    });
  });

  describe('findAllByClientId', () => {
    it('debería encontrar todos los miembros de un cliente', async () => {
      // Arrange
      const clientId = 'client-456';
      const member1 = testMember; // Ya tiene el clientId correcto
      
      const member2 = new Member(
        'member-456',
        clientId,
        'Jane',
        'Smith',
        'jane@example.com',
        '987654321',
        '456 Oak St',
        'MS002',
        true,
        '2023-01-02T00:00:00.000Z',
        '2023-01-02T00:00:00.000Z'
      );
      
      const member3 = new Member(
        'member-789',
        'different-client',
        'Bob',
        'Johnson',
        'bob@example.com',
        '555555555',
        '789 Pine St',
        'MS003',
        true,
        '2023-01-03T00:00:00.000Z',
        '2023-01-03T00:00:00.000Z'
      );
      
      await repository.create(member1);
      await repository.create(member2);
      await repository.create(member3);
      
      // Act
      const members = await repository.findAllByClientId(clientId);
      
      // Assert
      expect(members).toHaveLength(2);
      expect(members).toContainEqual(member1);
      expect(members).toContainEqual(member2);
      expect(members).not.toContainEqual(member3);
    });

    it('debería devolver un array vacío cuando no hay miembros para el cliente', async () => {
      // Act
      const members = await repository.findAllByClientId('non-existing-client');
      
      // Assert
      expect(members).toEqual([]);
      expect(members).toHaveLength(0);
    });
  });

  describe('update', () => {
    it('debería actualizar un miembro existente', async () => {
      // Arrange
      await repository.create(testMember);
      
      const updatedData = {
        name: 'Updated Name',
        lastname: 'Updated Lastname',
        phone: '999999999'
      };
      
      // Act
      const updatedMember = await repository.update(testMember.id, updatedData);
      
      // Assert
      expect(updatedMember.name).toEqual(updatedData.name);
      expect(updatedMember.lastname).toEqual(updatedData.lastname);
      expect(updatedMember.phone).toEqual(updatedData.phone);
      
      // Verificar que se actualizó en el repositorio
      const storedMember = await repository.findById(testMember.id);
      expect(storedMember).not.toBeNull();
      expect(storedMember!.name).toEqual(updatedData.name);
      expect(storedMember!.lastname).toEqual(updatedData.lastname);
      expect(storedMember!.phone).toEqual(updatedData.phone);
    });

    it('debería lanzar MemberNotFoundException al actualizar un miembro inexistente', async () => {
      // Act & Assert
      await expect(repository.update('non-existing-id', { name: 'Updated Name' }))
        .rejects.toThrow(MemberNotFoundException);
    });
  });

  describe('delete', () => {
    it('debería eliminar un miembro existente', async () => {
      // Arrange
      await repository.create(testMember);
      
      // Act
      await repository.delete(testMember.id);
      
      // Assert
      const deletedMember = await repository.findById(testMember.id);
      expect(deletedMember).toBeNull();
    });

    it('debería lanzar MemberNotFoundException al eliminar un miembro inexistente', async () => {
      // Act & Assert
      await expect(repository.delete('non-existing-id'))
        .rejects.toThrow(MemberNotFoundException);
    });
  });
}); 