import { Injectable, Inject } from '@nestjs/common';
import { AuthRepository } from '../ports/auth.repository';
import { AUTH_REPOSITORY } from '../../auth.module';
import { UniqueId } from '../../../shared/domain/types';
import { AuthNotFoundException } from '../../domain/exceptions/auth-not-found.exception';

@Injectable()
export class DeleteAuthUseCase {
  constructor(
    @Inject(AUTH_REPOSITORY)
    private readonly authRepository: AuthRepository
  ) {}

  async execute(id: UniqueId): Promise<void> {
    try {
      // Verificar si existe
      await this.authRepository.findById(id);
      
      // Eliminar
      return this.authRepository.delete(id);
    } catch (error) {
      throw new AuthNotFoundException(id);
    }
  }
} 