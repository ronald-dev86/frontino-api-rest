import { Injectable, Inject } from '@nestjs/common';
import { ResetPasswordDto } from '../dtos/reset-password.dto';
import { USER_REPOSITORY } from '../../../users/users.module';
import { UserRepository } from '../../../users/application/ports/user.repository';
import { PasswordHash } from '../../../users/application/ports/password-hash.port';
import { PASSWORD_HASH } from '../../../users/users.module';
import { InvalidCredentialsException } from '../../domain/exceptions/invalid-credentials.exception';

@Injectable()
export class ResetPasswordUseCase {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: UserRepository,
    @Inject(PASSWORD_HASH)
    private readonly passwordHash: PasswordHash
  ) {}

  async execute(resetPasswordDto: ResetPasswordDto): Promise<void> {
    try {
      // Buscar usuario por email
      const user = await this.userRepository.findByEmail(resetPasswordDto.email);
      
      // Verificar contraseña actual
      const isPasswordValid = await this.passwordHash.compare(
        resetPasswordDto.password,
        user.password
      );
      
      if (!isPasswordValid) {
        throw new InvalidCredentialsException();
      }
      
      // Hashear nueva contraseña
      const hashedPassword = await this.passwordHash.hash(resetPasswordDto.newPassword);
      
      // Actualizar contraseña
      user.password = hashedPassword;
      
      // Guardar cambios
      await this.userRepository.update(user.id, { password: hashedPassword });
    } catch (error) {
      throw new InvalidCredentialsException();
    }
  }
} 