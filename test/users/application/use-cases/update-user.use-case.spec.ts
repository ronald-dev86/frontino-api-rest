import { UpdateUserUseCase } from '../../../../src/users/application/use-cases/update-user.use-case';
import { UserRepository } from '../../../../src/users/application/ports/user.repository';
import { PasswordHash } from '../../../../src/users/application/ports/password-hash.port';
import { UpdateUserDto } from '../../../../src/users/application/dtos/update-user.dto';
import { User } from '../../../../src/users/domain/entities/user.entity';
import { Roles } from '../../../../src/users/domain/enums/roles.enum';
import { mock, instance, when, verify, anything } from 'ts-mockito';
import { UserNotFoundException } from '../../../../src/users/domain/exceptions/user-not-found.exception';
import { EmailAlreadyExistsException } from '../../../../src/users/domain/exceptions/email-already-exists.exception';

describe('UpdateUserUseCase', () => {
  let updateUserUseCase: UpdateUserUseCase;
  let mockUserRepository: UserRepository;
  let mockPasswordHash: PasswordHash;

  beforeEach(() => {
    // Crear mocks
    mockUserRepository = mock<UserRepository>();
    mockPasswordHash = mock<PasswordHash>();
    
    // Instanciar el caso de uso con los mocks
    updateUserUseCase = new UpdateUserUseCase(
      instance(mockUserRepository),
      instance(mockPasswordHash)
    );
  });

  it('debería actualizar un usuario correctamente y hashear la nueva contraseña', async () => {
    // Arrange
    const userId = 'user-id-123';
    const updateUserDto: UpdateUserDto = {
      email: 'updated@example.com',
      password: 'new_password',
      rol: Roles.ADMIN,
      active: true,
      idAssociatedAccounts: ['account-1']
    };

    const existingUser = User.create(
      userId,
      [],
      'old@example.com',
      'old_hashed_password',
      Roles.CLIENT,
      true,
      new Date().toISOString(),
      new Date().toISOString()
    );

    const hashedPassword = 'new_hashed_password_456';
    
    // Configurar el comportamiento del mock para findById
    when(mockUserRepository.findById(userId)).thenResolve(existingUser);
    
    // Configurar el comportamiento del mock para findByEmail (que no encuentre otro usuario con ese email)
    when(mockUserRepository.findByEmail(updateUserDto.email!))
      .thenReject(new Error(`Usuario con email ${updateUserDto.email} no encontrado`));
    
    // Configurar el comportamiento del mock para hash
    when(mockPasswordHash.hash(updateUserDto.password!)).thenResolve(hashedPassword);
    
    // Configurar el comportamiento del mock para update
    when(mockUserRepository.update(userId, anything())).thenCall((id, userData) => {
      // Verificar que la contraseña está hasheada
      expect(userData.password).toBe(hashedPassword);
      
      const updatedUser = User.create(
        id,
        userData.idAssociatedAccounts ?? existingUser.idAssociatedAccounts,
        userData.email ?? existingUser.email,
        userData.password ?? existingUser.password,
        userData.rol ?? existingUser.rol,
        userData.active !== undefined ? userData.active : existingUser.active,
        existingUser.createdAt,
        new Date().toISOString()
      );
      
      return Promise.resolve(updatedUser);
    });

    // Act
    const result = await updateUserUseCase.execute(userId, updateUserDto);

    // Assert
    expect(result).toBeDefined();
    expect(result.email).toBe(updateUserDto.email);
    expect(result.password).toBe(hashedPassword); // Verificar que la contraseña está hasheada
    expect(result.rol).toBe(updateUserDto.rol);
    
    // Verificar que los métodos fueron llamados
    verify(mockPasswordHash.hash(updateUserDto.password!)).once();
    verify(mockUserRepository.update(userId, anything())).once();
  });

  it('debería actualizar un usuario sin cambiar la contraseña', async () => {
    // Arrange
    const userId = 'user-id-123';
    const updateUserDto: UpdateUserDto = {
      email: 'updated@example.com',
      // No password provided
      rol: Roles.ADMIN,
      active: true,
      idAssociatedAccounts: ['account-1']
    };

    const existingUser = User.create(
      userId,
      [],
      'old@example.com',
      'old_hashed_password',
      Roles.CLIENT,
      true,
      new Date().toISOString(),
      new Date().toISOString()
    );
    
    // Configurar el comportamiento del mock para findById
    when(mockUserRepository.findById(userId)).thenResolve(existingUser);
    
    // Configurar el comportamiento del mock para findByEmail (que no encuentre otro usuario con ese email)
    when(mockUserRepository.findByEmail(updateUserDto.email!))
      .thenReject(new Error(`Usuario con email ${updateUserDto.email} no encontrado`));
    
    // Configurar el comportamiento del mock para update
    when(mockUserRepository.update(userId, anything())).thenResolve(existingUser);

    // Act
    await updateUserUseCase.execute(userId, updateUserDto);

    // Assert
    // Verificar que el método hash nunca fue llamado
    verify(mockPasswordHash.hash(anything())).never();
  });

  it('debería lanzar UserNotFoundException si el usuario no existe', async () => {
    // Arrange
    const userId = 'non-existent-id';
    const updateUserDto: UpdateUserDto = {
      email: 'updated@example.com'
    };

    // Configurar el comportamiento del mock para findById
    when(mockUserRepository.findById(userId)).thenReject(new UserNotFoundException(userId));

    // Act & Assert
    await expect(updateUserUseCase.execute(userId, updateUserDto))
      .rejects
      .toThrow(UserNotFoundException);
    
    // Verificar que el método update nunca fue llamado
    verify(mockUserRepository.update(anything(), anything())).never();
  });

  it('debería lanzar EmailAlreadyExistsException si el email ya está en uso por otro usuario', async () => {
    // Arrange
    const userId = 'user-id-123';
    const updateUserDto: UpdateUserDto = {
      email: 'existing@example.com'
    };

    const existingUser = User.create(
      userId,
      [],
      'old@example.com',
      'old_hashed_password',
      Roles.CLIENT,
      true,
      new Date().toISOString(),
      new Date().toISOString()
    );

    const anotherUser = User.create(
      'another-user-id',
      [],
      'existing@example.com',
      'another_password',
      Roles.CLIENT,
      true,
      new Date().toISOString(),
      new Date().toISOString()
    );
    
    // Configurar el comportamiento del mock para findById
    when(mockUserRepository.findById(userId)).thenResolve(existingUser);
    
    // Configurar el comportamiento del mock para findByEmail (que encuentre otro usuario con ese email)
    when(mockUserRepository.findByEmail(updateUserDto.email!))
      .thenResolve(anotherUser);

    // Act & Assert
    await expect(updateUserUseCase.execute(userId, updateUserDto))
      .rejects
      .toThrow(EmailAlreadyExistsException);
    
    // Verificar que el método update nunca fue llamado
    verify(mockUserRepository.update(anything(), anything())).never();
  });
}); 