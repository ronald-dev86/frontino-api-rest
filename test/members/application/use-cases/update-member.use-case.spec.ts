import { UpdateMemberUseCase } from '../../../../src/members/application/use-cases/update-member.use-case';
import { Member } from '../../../../src/members/domain/entities/member.entity';
import { MemberRepository } from '../../../../src/members/application/ports/member.repository';
import { UpdateMemberDto } from '../../../../src/members/application/dtos/update-member.dto';
import { MemberNotFoundException } from '../../../../src/members/domain/exceptions/member-not-found.exception';
import { DuplicateMeterSerialException } from '../../../../src/members/domain/exceptions/duplicate-meter-serial.exception';
import { InvalidMemberDataException } from '../../../../src/members/domain/exceptions/invalid-member-data.exception';
import { mock, instance, when, verify, anything } from 'ts-mockito';

describe('UpdateMemberUseCase', () => {
  let updateMemberUseCase: UpdateMemberUseCase;
  let mockMemberRepository: MemberRepository;

  beforeEach(() => {
    // Crear mock del repositorio
    mockMemberRepository = mock<MemberRepository>();
    
    // Crear instancia del caso de uso con el mock del repositorio
    updateMemberUseCase = new UpdateMemberUseCase(
      instance(mockMemberRepository)
    );
  });

  it('debería actualizar un miembro correctamente', async () => {
    // Arrange
    const memberId = 'member-123';
    const existingMember = new Member(
      memberId,
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
    
    const updateMemberDto: UpdateMemberDto = {
      name: 'Updated John',
      lastname: 'Updated Doe',
      phone: '987654321',
      email: 'updated.john@example.com'
    };
    
    const updatedMember = new Member(
      memberId,
      'client-456',
      updateMemberDto.name!,
      updateMemberDto.lastname!,
      updateMemberDto.email!,
      updateMemberDto.phone!,
      '123 Main St',
      'MS001',
      true,
      '2023-01-01T00:00:00.000Z',
      '2023-01-02T00:00:00.000Z' // Fecha de actualización diferente
    );
    
    // Mock para findById para retornar el miembro existente
    when(mockMemberRepository.findById(memberId)).thenResolve(existingMember);
    
    // Mock para update para retornar el miembro actualizado
    when(mockMemberRepository.update(memberId, anything())).thenResolve(updatedMember);

    // Act
    const result = await updateMemberUseCase.execute(memberId, updateMemberDto);

    // Assert
    expect(result).toEqual(updatedMember);
    expect(result.name).toEqual(updateMemberDto.name);
    expect(result.lastname).toEqual(updateMemberDto.lastname);
    expect(result.email).toEqual(updateMemberDto.email);
    expect(result.phone).toEqual(updateMemberDto.phone);
    
    verify(mockMemberRepository.findById(memberId)).once();
    verify(mockMemberRepository.update(memberId, anything())).once();
  });

  it('debería actualizar el meterSerial cuando no está duplicado', async () => {
    // Arrange
    const memberId = 'member-123';
    const existingMember = new Member(
      memberId,
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
    
    const updateMemberDto: UpdateMemberDto = {
      meterSerial: 'MS002'
    };
    
    const updatedMember = new Member(
      memberId,
      'client-456',
      'John',
      'Doe',
      'john@example.com',
      '123456789',
      '123 Main St',
      updateMemberDto.meterSerial!,
      true,
      '2023-01-01T00:00:00.000Z',
      '2023-01-02T00:00:00.000Z'
    );
    
    // Mock para findById para retornar el miembro existente
    when(mockMemberRepository.findById(memberId)).thenResolve(existingMember);
    
    // Mock para findByMeterSerial para retornar null (no hay duplicado)
    when(mockMemberRepository.findByMeterSerial(updateMemberDto.meterSerial!)).thenResolve(null);
    
    // Mock para update para retornar el miembro actualizado
    when(mockMemberRepository.update(memberId, anything())).thenResolve(updatedMember);

    // Act
    const result = await updateMemberUseCase.execute(memberId, updateMemberDto);

    // Assert
    expect(result).toEqual(updatedMember);
    expect(result.meterSerial).toEqual(updateMemberDto.meterSerial);
    
    verify(mockMemberRepository.findById(memberId)).once();
    verify(mockMemberRepository.findByMeterSerial(updateMemberDto.meterSerial!)).once();
    verify(mockMemberRepository.update(memberId, anything())).once();
  });

  it('debería lanzar DuplicateMeterSerialException cuando el meterSerial ya existe', async () => {
    // Arrange
    const memberId = 'member-123';
    const existingMember = new Member(
      memberId,
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
    
    const updateMemberDto: UpdateMemberDto = {
      meterSerial: 'MS002'
    };
    
    const memberWithSameSerial = new Member(
      'another-member',
      'client-789',
      'Jane',
      'Smith',
      'jane@example.com',
      '987654321',
      '456 Oak St',
      updateMemberDto.meterSerial!,
      true,
      '2023-01-02T00:00:00.000Z',
      '2023-01-02T00:00:00.000Z'
    );
    
    // Mock para findById para retornar el miembro existente
    when(mockMemberRepository.findById(memberId)).thenResolve(existingMember);
    
    // Mock para findByMeterSerial para retornar un miembro existente (hay duplicado)
    when(mockMemberRepository.findByMeterSerial(updateMemberDto.meterSerial!)).thenResolve(memberWithSameSerial);

    // Act & Assert
    await expect(updateMemberUseCase.execute(memberId, updateMemberDto))
      .rejects.toThrow(DuplicateMeterSerialException);
    
    verify(mockMemberRepository.findById(memberId)).once();
    verify(mockMemberRepository.findByMeterSerial(updateMemberDto.meterSerial!)).once();
    verify(mockMemberRepository.update(memberId, anything())).never();
  });

  it('debería ignorar la verificación de meterSerial si no se cambia', async () => {
    // Arrange
    const memberId = 'member-123';
    const meterSerial = 'MS001';
    const existingMember = new Member(
      memberId,
      'client-456',
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
    
    const updateMemberDto: UpdateMemberDto = {
      name: 'Updated John',
      // Mismo meterSerial
      meterSerial: meterSerial
    };
    
    const updatedMember = new Member(
      memberId,
      'client-456',
      updateMemberDto.name!,
      'Doe',
      'john@example.com',
      '123456789',
      '123 Main St',
      meterSerial,
      true,
      '2023-01-01T00:00:00.000Z',
      '2023-01-02T00:00:00.000Z'
    );
    
    // Mock para findById para retornar el miembro existente
    when(mockMemberRepository.findById(memberId)).thenResolve(existingMember);
    
    // Mock para update para retornar el miembro actualizado
    when(mockMemberRepository.update(memberId, anything())).thenResolve(updatedMember);

    // Act
    const result = await updateMemberUseCase.execute(memberId, updateMemberDto);

    // Assert
    expect(result).toEqual(updatedMember);
    
    // No debería llamar a findByMeterSerial porque no cambió el número de serie
    verify(mockMemberRepository.findById(memberId)).once();
    verify(mockMemberRepository.findByMeterSerial(anything())).never();
    verify(mockMemberRepository.update(memberId, anything())).once();
  });

  it('debería lanzar MemberNotFoundException cuando el miembro no existe', async () => {
    // Arrange
    const memberId = 'non-existing-id';
    const updateMemberDto: UpdateMemberDto = {
      name: 'Updated John'
    };
    
    // Mock para findById para retornar null (miembro no existe)
    when(mockMemberRepository.findById(memberId)).thenResolve(null);

    // Act & Assert
    await expect(updateMemberUseCase.execute(memberId, updateMemberDto))
      .rejects.toThrow(MemberNotFoundException);
    
    verify(mockMemberRepository.findById(memberId)).once();
    verify(mockMemberRepository.update(memberId, anything())).never();
  });

  it('debería lanzar InvalidMemberDataException cuando ocurre un error al actualizar', async () => {
    // Arrange
    const memberId = 'member-123';
    const existingMember = new Member(
      memberId,
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
    
    const updateMemberDto: UpdateMemberDto = {
      name: 'Updated John'
    };
    
    // Mock para findById para retornar el miembro existente
    when(mockMemberRepository.findById(memberId)).thenResolve(existingMember);
    
    // Mock para update para lanzar un error
    when(mockMemberRepository.update(memberId, anything())).thenReject(new Error('Error al actualizar miembro'));

    // Act & Assert
    await expect(updateMemberUseCase.execute(memberId, updateMemberDto))
      .rejects.toThrow(InvalidMemberDataException);
    
    verify(mockMemberRepository.findById(memberId)).once();
    verify(mockMemberRepository.update(memberId, anything())).once();
  });
}); 