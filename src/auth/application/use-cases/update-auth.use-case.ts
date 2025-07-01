import { Injectable, Inject } from '@nestjs/common';
import { Auth } from '../../domain/entities/auth.entity';
import { AuthRepository } from '../ports/auth.repository';
import { AUTH_REPOSITORY } from '../../auth.module';
import { UniqueId } from '../../../shared/domain/types';
import { UpdateAuthDto } from '../dtos/update-auth.dto';
import { AuthNotFoundException } from '../../domain/exceptions/auth-not-found.exception';

@Injectable()
export class UpdateAuthUseCase {
  constructor(
    @Inject(AUTH_REPOSITORY)
    private readonly authRepository: AuthRepository
  ) {}

  async execute(id: UniqueId, updateAuthDto: UpdateAuthDto): Promise<Auth> {
    try {
      const auth = await this.authRepository.findById(id);
      
      if (updateAuthDto.token) {
        auth.token = updateAuthDto.token;
      }
      
      return this.authRepository.update(auth);
    } catch (error) {
      throw new AuthNotFoundException(id);
    }
  }
} 