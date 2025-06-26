import { Injectable } from '@nestjs/common';
import { User } from '../../domain/entities/user.entity';
import { UserRepository } from '../ports/user.repository';
import { UpdateUserDto } from '../dtos/update-user.dto';
import { UserNotFoundException } from '../../domain/exceptions/user-not-found.exception';
import { InvalidUserDataException } from '../../domain/exceptions/invalid-user-data.exception';
import { EmailAlreadyExistsException } from '../../domain/exceptions/email-already-exists.exception';

@Injectable()
export class UpdateUserUseCase {
  constructor(
    private readonly userRepository: UserRepository
  ) {}

  async execute(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    try {
      const existingUser = await this.userRepository.findById(id);
      if (!existingUser) {
        throw new UserNotFoundException(id);
      }

      // Si se está actualizando el email, verificar que no exista otro usuario con ese email
      if (updateUserDto.email && updateUserDto.email !== existingUser.email) {
        try {
          const userWithEmail = await this.userRepository.findByEmail(updateUserDto.email);
          if (userWithEmail && userWithEmail.id !== id) {
            throw new EmailAlreadyExistsException(updateUserDto.email);
          }
        } catch (error) {
          // Si el error es porque no encontró el usuario, podemos continuar
          // De lo contrario, relanzamos el error
          if (!(error instanceof Error && error.message.includes('no encontrado'))) {
            throw error;
          }
        }
      }

      return this.userRepository.update(id, {
        idAssociatedAccounts: updateUserDto.idAssociatedAccounts,
        email: updateUserDto.email,
        password: updateUserDto.password,
        rol: updateUserDto.rol,
        active: updateUserDto.active,
      });
    } catch (error) {
      if (error instanceof UserNotFoundException || error instanceof EmailAlreadyExistsException) {
        throw error;
      }
      throw new InvalidUserDataException(
        error instanceof Error ? error.message : 'Error al actualizar usuario',
      );
    }
  }
} 