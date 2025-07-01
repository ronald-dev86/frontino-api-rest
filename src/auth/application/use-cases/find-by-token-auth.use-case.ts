import { Injectable, Inject } from '@nestjs/common';
import { Auth } from '../../domain/entities/auth.entity';
import { AuthRepository } from '../ports/auth.repository';
import { AUTH_REPOSITORY } from '../../auth.module';
import { TokenNotFoundException } from '../../domain/exceptions/token-not-found.exception';

@Injectable()
export class FindByTokenAuthUseCase {
  constructor(
    @Inject(AUTH_REPOSITORY)
    private readonly authRepository: AuthRepository
  ) {}

  async execute(token: string): Promise<Auth> {
    try {
      return await this.authRepository.findByToken(token);
    } catch (error) {
      throw new TokenNotFoundException(token);
    }
  }
} 