import { Injectable, Inject } from '@nestjs/common';
import { Auth } from '../../domain/entities/auth.entity';
import { AuthRepository } from '../ports/auth.repository';
import { AUTH_REPOSITORY } from '../../auth.module';
import { LoginDto } from '../dtos/login.dto';
import { v4 as uuidv4 } from 'uuid';
import { InvalidCredentialsException } from '../../domain/exceptions/invalid-credentials.exception';
import { USER_REPOSITORY } from '../../../users/users.module';
import { UserRepository } from '../../../users/application/ports/user.repository';
import { PasswordHash } from '../../../users/application/ports/password-hash.port';
import { PASSWORD_HASH } from '../../../users/users.module';
import { JwtService } from '../../../shared/application/ports/jwt.port';
import { JWT_SERVICE } from '../../auth.module';

@Injectable()
export class LoginUseCase {
  constructor(
    @Inject(AUTH_REPOSITORY)
    private readonly authRepository: AuthRepository,
    @Inject(USER_REPOSITORY)
    private readonly userRepository: UserRepository,
    @Inject(PASSWORD_HASH)
    private readonly passwordHash: PasswordHash,
    @Inject(JWT_SERVICE)
    private readonly jwtService: JwtService
  ) {}

  async execute(loginDto: LoginDto): Promise<Auth> {
    try {
      // Buscar usuario por email
      const user = await this.userRepository.findByEmail(loginDto.email);
      
      // Verificar contraseña
      const isPasswordValid = await this.passwordHash.compare(
        loginDto.password,
        user.password
      );
      
      if (!isPasswordValid) {
        throw new InvalidCredentialsException();
      }
      
      // Generar token JWT
      const payload = {
        sub: user.id,
        email: user.email,
        rol: user.rol
      };
      
      const token = this.jwtService.sign(payload);
      const now = new Date().toISOString();
      
      // Crear autenticación
      const auth = new Auth(
        uuidv4(),
        user.id,
        token,
        now
      );
      
      return this.authRepository.save(auth);
    } catch (error) {
      throw new InvalidCredentialsException();
    }
  }
} 