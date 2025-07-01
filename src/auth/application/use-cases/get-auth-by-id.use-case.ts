import { Injectable, Inject } from '@nestjs/common';
import { Auth } from '../../domain/entities/auth.entity';
import { AuthRepository } from '../ports/auth.repository';
import { AUTH_REPOSITORY } from '../../auth.module';
import { UniqueId } from '../../../shared/domain/types';
import { AuthNotFoundException } from '../../domain/exceptions/auth-not-found.exception';

@Injectable()
export class GetAuthByIdUseCase {
  constructor(
    @Inject(AUTH_REPOSITORY)
    private readonly authRepository: AuthRepository
  ) {}

  async execute(id: UniqueId): Promise<Auth> {
    try {
      return await this.authRepository.findById(id);
    } catch (error) {
      throw new AuthNotFoundException(id);
    }
  }
} 