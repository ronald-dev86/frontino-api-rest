import { Injectable } from '@nestjs/common';
import { User } from '../../domain/entities/user.entity';
import { UserRepository } from '../ports/user.repository';

@Injectable()
export class GetAllUsersUseCase {
  constructor(
    private readonly userRepository: UserRepository
  ) {}

  async execute(): Promise<User[]> {
    return this.userRepository.findAll();
  }
} 