import { DeleteMemberUseCase } from '../../../../src/members/application/use-cases/delete-member.use-case';
import { Member } from '../../../../src/members/domain/entities/member.entity';
import { MemberRepository } from '../../../../src/members/application/ports/member.repository';
import { MemberNotFoundException } from '../../../../src/members/domain/exceptions/member-not-found.exception';
import { mock, instance, when, verify, anything } from 'ts-mockito';

describe('DeleteMemberUseCase', () => {
  let deleteMemberUseCase: DeleteMemberUseCase;
  let mockMemberRepository: MemberRepository;

  beforeEach(() => {
    // Crear mock del repositorio
    mockMemberRepository = mock<MemberRepository>();
    
    // Crear instancia del caso de uso con el mock del repositorio
    deleteMemberUseCase = new DeleteMemberUseCase(
      instance(mockMemberRepository)
    );
  });

  it('debería eliminar un miembro correctamente', async () => {
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
    
    // Mock para findById para retornar el miembro existente
    when(mockMemberRepository.findById(memberId)).thenResolve(existingMember);
    
    // Mock para delete para simular eliminación exitosa
    when(mockMemberRepository.delete(memberId)).thenResolve();

    // Act
    await deleteMemberUseCase.execute(memberId);

    // Assert
    verify(mockMemberRepository.findById(memberId)).once();
    verify(mockMemberRepository.delete(memberId)).once();
  });

  it('debería lanzar MemberNotFoundException cuando el miembro no existe', async () => {
    // Arrange
    const memberId = 'non-existing-id';
    
    // Mock para findById para retornar null (miembro no existe)
    when(mockMemberRepository.findById(memberId)).thenResolve(null);

    // Act & Assert
    await expect(deleteMemberUseCase.execute(memberId))
      .rejects.toThrow(MemberNotFoundException);
    
    verify(mockMemberRepository.findById(memberId)).once();
    verify(mockMemberRepository.delete(memberId)).never();
  });

  it('debería propagar errores cuando falla la eliminación', async () => {
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
    
    const errorMessage = 'Error al eliminar miembro';
    const deleteError = new Error(errorMessage);
    
    // Mock para findById para retornar el miembro existente
    when(mockMemberRepository.findById(memberId)).thenResolve(existingMember);
    
    // Mock para delete para lanzar un error
    when(mockMemberRepository.delete(memberId)).thenReject(deleteError);

    // Act & Assert
    await expect(deleteMemberUseCase.execute(memberId))
      .rejects.toThrow(deleteError);
    
    verify(mockMemberRepository.findById(memberId)).once();
    verify(mockMemberRepository.delete(memberId)).once();
  });
}); 