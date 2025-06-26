import { Injectable } from '@nestjs/common';
import { UserRepository } from '../ports/user.repository';
import { UserNotFoundException } from '../../domain/exceptions/user-not-found.exception';

@Injectable()
export class DeleteUserUseCase {
  constructor(
    private readonly userRepository: UserRepository
  ) {}

  async execute(id: string): Promise<void> {
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new UserNotFoundException(id);
    }

    await this.userRepository.delete(id);
  }
} 