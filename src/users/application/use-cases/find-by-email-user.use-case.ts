import { Injectable } from '@nestjs/common';
import { User } from '../../domain/entities/user.entity';
import { UserRepository } from '../ports/user.repository';

@Injectable()
export class FindByEmailUserUseCase {
  constructor(
    private readonly userRepository: UserRepository
  ) {}

  async execute(email: string): Promise<User> {
    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      throw new Error(`Usuario con email ${email} no encontrado`);
    }
    return user;
  }
} 