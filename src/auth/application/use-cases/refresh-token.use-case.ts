import { Injectable, Inject } from '@nestjs/common';
import { Auth } from '../../domain/entities/auth.entity';
import { AuthRepository } from '../ports/auth.repository';
import { AUTH_REPOSITORY } from '../../auth.module';
import { RefreshTokenDto } from '../dtos/refresh-token.dto';
import { TokenNotFoundException } from '../../domain/exceptions/token-not-found.exception';
import { JwtService } from '../ports/jwt.port';
import { JWT_SERVICE } from '../../auth.module';

@Injectable()
export class RefreshTokenUseCase {
  constructor(
    @Inject(AUTH_REPOSITORY)
    private readonly authRepository: AuthRepository,
    @Inject(JWT_SERVICE)
    private readonly jwtService: JwtService
  ) {}

  async execute(refreshTokenDto: RefreshTokenDto): Promise<Auth> {
    try {
      // Buscar autenticación por token
      const auth = await this.authRepository.findByToken(refreshTokenDto.oldToken);
      
      // Verificar que el token pertenezca al usuario
      if (auth.idUser !== refreshTokenDto.idUser) {
        throw new TokenNotFoundException(refreshTokenDto.oldToken);
      }
      
      // Verificar el token actual
      const decoded = this.jwtService.verify(refreshTokenDto.oldToken);
      if (!decoded) {
        throw new TokenNotFoundException(refreshTokenDto.oldToken);
      }
      
      // Generar nuevo token con la misma información pero nueva expiración
      const payload = {
        sub: decoded.sub,
        email: decoded.email,
        rol: decoded.rol
      };
      
      const newToken = this.jwtService.sign(payload);
      
      // Actualizar token
      auth.token = newToken;
      
      // Guardar cambios
      return this.authRepository.update(auth);
    } catch (error) {
      throw new TokenNotFoundException(refreshTokenDto.oldToken);
    }
  }
} 