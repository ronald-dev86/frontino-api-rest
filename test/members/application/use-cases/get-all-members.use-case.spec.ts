import { GetAllMembersUseCase } from '../../../../src/members/application/use-cases/get-all-members.use-case';
import { Member } from '../../../../src/members/domain/entities/member.entity';
import { MemberRepository } from '../../../../src/members/application/ports/member.repository';
import { mock, instance, when, verify } from 'ts-mockito';

describe('GetAllMembersUseCase', () => {
  let getAllMembersUseCase: GetAllMembersUseCase;
  let mockMemberRepository: MemberRepository;

  beforeEach(() => {
    // Crear mock del repositorio
    mockMemberRepository = mock<MemberRepository>();
    
    // Crear instancia del caso de uso con el mock del repositorio
    getAllMembersUseCase = new GetAllMembersUseCase(
      instance(mockMemberRepository)
    );
  });

  it('debería retornar todos los miembros', async () => {
    // Arrange
    const members = [
      new Member(
        'member-1',
        'client-1',
        'John',
        'Doe',
        'john@example.com',
        '123456789',
        '123 Main St',
        'MS001',
        true,
        '2023-01-01T00:00:00.000Z',
        '2023-01-01T00:00:00.000Z'
      ),
      new Member(
        'member-2',
        'client-2',
        'Jane',
        'Smith',
        'jane@example.com',
        '987654321',
        '456 Oak St',
        'MS002',
        true,
        '2023-01-02T00:00:00.000Z',
        '2023-01-02T00:00:00.000Z'
      )
    ];
    
    // Mock para findAll para retornar los miembros
    when(mockMemberRepository.findAll()).thenResolve(members);

    // Act
    const result = await getAllMembersUseCase.execute();

    // Assert
    expect(result).toEqual(members);
    expect(result.length).toBe(2);
    verify(mockMemberRepository.findAll()).once();
  });

  it('debería retornar un array vacío cuando no hay miembros', async () => {
    // Arrange
    // Mock para findAll para retornar un array vacío
    when(mockMemberRepository.findAll()).thenResolve([]);

    // Act
    const result = await getAllMembersUseCase.execute();

    // Assert
    expect(result).toEqual([]);
    expect(result.length).toBe(0);
    verify(mockMemberRepository.findAll()).once();
  });
}); 