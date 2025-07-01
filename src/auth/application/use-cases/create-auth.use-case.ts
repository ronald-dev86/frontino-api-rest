import { Injectable, Inject } from '@nestjs/common';
import { Auth } from '../../domain/entities/auth.entity';
import { AuthRepository } from '../ports/auth.repository';
import { CreateAuthDto } from '../dtos/create-auth.dto';
import { AUTH_REPOSITORY } from '../../auth.module';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class CreateAuthUseCase {
  constructor(
    @Inject(AUTH_REPOSITORY)
    private readonly authRepository: AuthRepository
  ) {}

  async execute(createAuthDto: CreateAuthDto): Promise<Auth> {
    const now = new Date().toISOString();
    
    const auth = new Auth(
      uuidv4(),
      createAuthDto.idUser,
      createAuthDto.token,
      now
    );

    return this.authRepository.save(auth);
  }
} 