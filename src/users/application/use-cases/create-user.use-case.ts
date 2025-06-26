import { Inject, Injectable } from '@nestjs/common';
import { User } from '../../domain/entities/user.entity';
import { UserRepository } from '../ports/user.repository';
import { PasswordHash } from '../ports/password-hash.port';
import { CreateUserDto } from '../dtos/create-user.dto';
import { InvalidUserDataException } from '../../domain/exceptions/invalid-user-data.exception';
import { EmailAlreadyExistsException } from '../../domain/exceptions/email-already-exists.exception';
import { v4 as uuidv4 } from 'uuid';
import { PASSWORD_HASH, USER_REPOSITORY } from '../../users.module';

@Injectable()
export class CreateUserUseCase {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: UserRepository,
    @Inject(PASSWORD_HASH)
    private readonly passwordHash: PasswordHash
  ) {}

  async execute(createUserDto: CreateUserDto): Promise<User> {
    try {
      const { idAssociatedAccounts = [], email, password, rol, active = true } = createUserDto;

      // Verificar si ya existe un usuario con ese email
      try {
        const existingUser = await this.userRepository.findByEmail(email);
        if (existingUser) {
          throw new EmailAlreadyExistsException(email);
        }
      } catch (error) {
        // Si el error es porque no encontró el usuario, podemos continuar
        // De lo contrario, relanzamos el error
        if (!(error instanceof Error && error.message.includes('no encontrado'))) {
          throw error;
        }
      }

      const id = uuidv4();
      const now = new Date().toISOString();

      // Convertir los IDs de cuentas asociadas a tipo UniqueId
      const associatedAccounts = idAssociatedAccounts.map(accountId => accountId);

      // Hashear la contraseña antes de crear el usuario
      const hashedPassword = await this.passwordHash.hash(password);

      const user = User.create(
        id,
        associatedAccounts,
        email,
        hashedPassword,
        rol,
        active,
        now,
        now,
      );

      return this.userRepository.save(user);
    } catch (error) {
      if (error instanceof EmailAlreadyExistsException) {
        throw error;
      }
      throw new InvalidUserDataException(
        error instanceof Error ? error.message : 'Error al crear usuario',
      );
    }
  }
} 