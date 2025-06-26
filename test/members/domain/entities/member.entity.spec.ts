import { Member } from '../../../../src/members/domain/entities/member.entity';

describe('Member Entity', () => {
  let member: Member;
  const memberId = 'member-123';
  const clientId = 'client-456';
  const initialDate = '2023-01-01T00:00:00.000Z';

  beforeEach(() => {
    member = new Member(
      memberId,
      clientId,
      'John',
      'Doe',
      'john.doe@example.com',
      '123456789',
      '123 Main St',
      'MS001',
      true,
      initialDate,
      initialDate
    );
  });

  it('debería crear un miembro válido', () => {
    // Assert
    expect(member).toBeTruthy();
    expect(member.id).toEqual(memberId);
    expect(member.idClient).toEqual(clientId);
    expect(member.name).toEqual('John');
    expect(member.lastname).toEqual('Doe');
    expect(member.email).toEqual('john.doe@example.com');
    expect(member.phone).toEqual('123456789');
    expect(member.address).toEqual('123 Main St');
    expect(member.meterSerial).toEqual('MS001');
    expect(member.active).toBeTruthy();
    expect(member.createdAt).toEqual(initialDate);
    expect(member.updatedAt).toEqual(initialDate);
  });

  it('debería permitir actualizar propiedades y actualizar updatedAt', () => {
    // Guardar el valor original de updatedAt
    const originalUpdatedAt = member.updatedAt;
    
    // Act - modificar algunas propiedades
    member.name = 'Jane';
    member.lastname = 'Smith';
    member.email = 'jane.smith@example.com';
    member.phone = '987654321';
    member.address = '456 Oak St';
    member.meterSerial = 'MS002';
    member.active = false;
    
    // Assert - verificar que las propiedades han cambiado
    expect(member.name).toEqual('Jane');
    expect(member.lastname).toEqual('Smith');
    expect(member.email).toEqual('jane.smith@example.com');
    expect(member.phone).toEqual('987654321');
    expect(member.address).toEqual('456 Oak St');
    expect(member.meterSerial).toEqual('MS002');
    expect(member.active).toBeFalsy();
    
    // Verificar que updatedAt ha sido actualizado
    expect(member.updatedAt).not.toEqual(originalUpdatedAt);
  });

  it('debería serializar correctamente a JSON', () => {
    // Act
    const memberJson = member.toJSON();
    
    // Assert
    expect(memberJson).toEqual({
      id: memberId,
      idClient: clientId,
      name: 'John',
      lastname: 'Doe',
      email: 'john.doe@example.com',
      phone: '123456789',
      address: '123 Main St',
      meterSerial: 'MS001',
      active: true,
      createdAt: initialDate,
      updatedAt: initialDate
    });
  });
}); 