import { CreateMemberUseCase } from '../../../../src/members/application/use-cases/create-member.use-case';
import { Member } from '../../../../src/members/domain/entities/member.entity';
import { MemberRepository } from '../../../../src/members/application/ports/member.repository';
import { CreateMemberDto } from '../../../../src/members/application/dtos/create-member.dto';
import { DuplicateMeterSerialException } from '../../../../src/members/domain/exceptions/duplicate-meter-serial.exception';
import { InvalidMemberDataException } from '../../../../src/members/domain/exceptions/invalid-member-data.exception';
import { mock, instance, when, verify, anyString, anything } from 'ts-mockito';

// Mock para uuid
jest.mock('uuid', () => ({
  v4: () => 'test-uuid'
}));

describe('CreateMemberUseCase', () => {
  let createMemberUseCase: CreateMemberUseCase;
  let mockMemberRepository: MemberRepository;

  beforeEach(() => {
    // Crear mock del repositorio
    mockMemberRepository = mock<MemberRepository>();
    
    // Crear instancia del caso de uso con el mock del repositorio
    createMemberUseCase = new CreateMemberUseCase(
      instance(mockMemberRepository)
    );
  });

  it('debería crear un miembro correctamente', async () => {
    // Arrange
    const createMemberDto: CreateMemberDto = {
      idClient: 'client-456',
      name: 'John',
      lastname: 'Doe',
      email: 'john.doe@example.com',
      phone: '123456789',
      address: '123 Main St',
      meterSerial: 'MS001',
      active: true
    };

    // Mock para findByMeterSerial para retornar null (no existe un miembro con ese serial)
    when(mockMemberRepository.findByMeterSerial(createMemberDto.meterSerial)).thenResolve(null);
    
    // Mock para create para retornar un miembro creado
    const expectedMember = new Member(
      'test-uuid',
      createMemberDto.idClient,
      createMemberDto.name,
      createMemberDto.lastname,
      createMemberDto.email,
      createMemberDto.phone,
      createMemberDto.address,
      createMemberDto.meterSerial,
      createMemberDto.active,
      expect.any(String), // La fecha createdAt
      expect.any(String)  // La fecha updatedAt
    );
    when(mockMemberRepository.create(anything())).thenResolve(expectedMember);

    // Act
    const result = await createMemberUseCase.execute(createMemberDto);

    // Assert
    expect(result).toEqual(expectedMember);
    verify(mockMemberRepository.findByMeterSerial(createMemberDto.meterSerial)).once();
    verify(mockMemberRepository.create(anything())).once();
  });

  it('debería lanzar DuplicateMeterSerialException cuando ya existe un miembro con el mismo meter serial', async () => {
    // Arrange
    const createMemberDto: CreateMemberDto = {
      idClient: 'client-456',
      name: 'John',
      lastname: 'Doe',
      email: 'john.doe@example.com',
      phone: '123456789',
      address: '123 Main St',
      meterSerial: 'MS001',
      active: true
    };

    // Mock existingMember
    const existingMember = new Member(
      'existing-id',
      'client-123',
      'Existing',
      'Member',
      'existing@example.com',
      '987654321',
      '456 Old St',
      'MS001',
      true,
      '2023-01-01T00:00:00.000Z',
      '2023-01-01T00:00:00.000Z'
    );
    
    // Mock para findByMeterSerial para retornar un miembro existente
    when(mockMemberRepository.findByMeterSerial(createMemberDto.meterSerial)).thenResolve(existingMember);

    // Act & Assert
    await expect(createMemberUseCase.execute(createMemberDto))
      .rejects.toThrow(DuplicateMeterSerialException);
    
    verify(mockMemberRepository.findByMeterSerial(createMemberDto.meterSerial)).once();
    verify(mockMemberRepository.create(anything())).never();
  });

  it('debería lanzar InvalidMemberDataException cuando ocurre un error al crear', async () => {
    // Arrange
    const createMemberDto: CreateMemberDto = {
      idClient: 'client-456',
      name: 'John',
      lastname: 'Doe',
      email: 'john.doe@example.com',
      phone: '123456789',
      address: '123 Main St',
      meterSerial: 'MS001',
      active: true
    };

    // Mock para findByMeterSerial para retornar null (no existe un miembro con ese serial)
    when(mockMemberRepository.findByMeterSerial(createMemberDto.meterSerial)).thenResolve(null);
    
    // Mock para create para lanzar un error
    when(mockMemberRepository.create(anything())).thenReject(new Error('Error al crear miembro'));

    // Act & Assert
    await expect(createMemberUseCase.execute(createMemberDto))
      .rejects.toThrow(InvalidMemberDataException);
    
    verify(mockMemberRepository.findByMeterSerial(createMemberDto.meterSerial)).once();
    verify(mockMemberRepository.create(anything())).once();
  });
}); 