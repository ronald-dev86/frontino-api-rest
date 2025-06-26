import { CreateUserUseCase } from '../../../../src/users/application/use-cases/create-user.use-case';
import { UserRepository } from '../../../../src/users/application/ports/user.repository';
import { PasswordHash } from '../../../../src/users/application/ports/password-hash.port';
import { CreateUserDto } from '../../../../src/users/application/dtos/create-user.dto';
import { User } from '../../../../src/users/domain/entities/user.entity';
import { Roles } from '../../../../src/users/domain/enums/roles.enum';
import { mock, instance, when, verify, anything } from 'ts-mockito';
import { EmailAlreadyExistsException } from '../../../../src/users/domain/exceptions/email-already-exists.exception';

describe('CreateUserUseCase', () => {
  let createUserUseCase: CreateUserUseCase;
  let mockUserRepository: UserRepository;
  let mockPasswordHash: PasswordHash;

  beforeEach(() => {
    // Crear mocks
    mockUserRepository = mock<UserRepository>();
    mockPasswordHash = mock<PasswordHash>();
    
    // Instanciar el caso de uso con los mocks
    createUserUseCase = new CreateUserUseCase(
      instance(mockUserRepository),
      instance(mockPasswordHash)
    );
  });

  it('debería crear un usuario correctamente y hashear la contraseña', async () => {
    // Arrange
    const createUserDto: CreateUserDto = {
      email: 'test@example.com',
      password: 'password123',
      rol: Roles.ADMIN,
      active: true,
      idAssociatedAccounts: []
    };

    const hashedPassword = 'hashed_password_123';
    
    // Configurar el comportamiento del mock para findByEmail (que no encuentre el usuario)
    when(mockUserRepository.findByEmail(createUserDto.email))
      .thenReject(new Error('Usuario con email test@example.com no encontrado'));
    
    // Configurar el comportamiento del mock para hash
    when(mockPasswordHash.hash(createUserDto.password)).thenResolve(hashedPassword);
    
    // Configurar el comportamiento del mock para save
    when(mockUserRepository.save(anything())).thenCall((user: User) => {
      // Verificar que la contraseña está hasheada
      expect(user.password).toBe(hashedPassword);
      return Promise.resolve(user);
    });

    // Act
    const result = await createUserUseCase.execute(createUserDto);

    // Assert
    expect(result).toBeDefined();
    expect(result.email).toBe(createUserDto.email);
    expect(result.password).toBe(hashedPassword); // Verificar que la contraseña está hasheada
    expect(result.rol).toBe(createUserDto.rol);
    
    // Verificar que los métodos fueron llamados
    verify(mockPasswordHash.hash(createUserDto.password)).once();
    verify(mockUserRepository.save(anything())).once();
  });

  it('debería lanzar EmailAlreadyExistsException si el email ya existe', async () => {
    // Arrange
    const createUserDto: CreateUserDto = {
      email: 'existing@example.com',
      password: 'password123',
      rol: Roles.ADMIN,
      active: true,
      idAssociatedAccounts: []
    };

    const existingUser = User.create(
      'existing-id',
      [],
      createUserDto.email,
      'hashed_password',
      createUserDto.rol,
      true,
      new Date().toISOString(),
      new Date().toISOString()
    );

    // Configurar el comportamiento del mock para findByEmail (que encuentre el usuario)
    when(mockUserRepository.findByEmail(createUserDto.email)).thenResolve(existingUser);

    // Act & Assert
    await expect(createUserUseCase.execute(createUserDto))
      .rejects
      .toThrow(EmailAlreadyExistsException);
    
    // Verificar que el método hash nunca fue llamado
    verify(mockPasswordHash.hash(anything())).never();
    // Verificar que el método save nunca fue llamado
    verify(mockUserRepository.save(anything())).never();
  });
}); 