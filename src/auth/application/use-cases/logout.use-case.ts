import { Injectable, Inject } from '@nestjs/common';
import { AuthRepository } from '../ports/auth.repository';
import { AUTH_REPOSITORY } from '../../auth.module';
import { TokenNotFoundException } from '../../domain/exceptions/token-not-found.exception';

@Injectable()
export class LogoutUseCase {
  constructor(
    @Inject(AUTH_REPOSITORY)
    private readonly authRepository: AuthRepository
  ) {}

  async execute(token: string): Promise<void> {
    try {
      // Buscar autenticación por token
      const auth = await this.authRepository.findByToken(token);
      
      // Eliminar autenticación
      return this.authRepository.delete(auth.id);
    } catch (error) {
      throw new TokenNotFoundException(token);
    }
  }
} 