import { GetMemberByIdUseCase } from '../../../../src/members/application/use-cases/get-member-by-id.use-case';
import { Member } from '../../../../src/members/domain/entities/member.entity';
import { MemberRepository } from '../../../../src/members/application/ports/member.repository';
import { MemberNotFoundException } from '../../../../src/members/domain/exceptions/member-not-found.exception';
import { mock, instance, when, verify } from 'ts-mockito';

describe('GetMemberByIdUseCase', () => {
  let getMemberByIdUseCase: GetMemberByIdUseCase;
  let mockMemberRepository: MemberRepository;

  beforeEach(() => {
    // Crear mock del repositorio
    mockMemberRepository = mock<MemberRepository>();
    
    // Crear instancia del caso de uso con el mock del repositorio
    getMemberByIdUseCase = new GetMemberByIdUseCase(
      instance(mockMemberRepository)
    );
  });

  it('debería retornar un miembro cuando existe', async () => {
    // Arrange
    const memberId = 'member-123';
    const expectedMember = new Member(
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
    
    // Mock para findById para retornar un miembro
    when(mockMemberRepository.findById(memberId)).thenResolve(expectedMember);

    // Act
    const result = await getMemberByIdUseCase.execute(memberId);

    // Assert
    expect(result).toEqual(expectedMember);
    verify(mockMemberRepository.findById(memberId)).once();
  });

  it('debería lanzar MemberNotFoundException cuando el miembro no existe', async () => {
    // Arrange
    const memberId = 'non-existing-id';
    
    // Mock para findById para retornar null
    when(mockMemberRepository.findById(memberId)).thenResolve(null);

    // Act & Assert
    await expect(getMemberByIdUseCase.execute(memberId))
      .rejects.toThrow(MemberNotFoundException);
    
    verify(mockMemberRepository.findById(memberId)).once();
  });
}); 