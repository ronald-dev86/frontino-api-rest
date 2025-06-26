import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { UserController } from './infrastructure/controllers/user.controller';
import { FirestoreUserRepository } from './infrastructure/repositories/firestore-user.repository';
import { InMemoryUserRepository } from './infrastructure/repositories/in-memory-user.repository';
import { CreateUserUseCase } from './application/use-cases/create-user.use-case';
import { GetUserByIdUseCase } from './application/use-cases/get-user-by-id.use-case';
import { GetAllUsersUseCase } from './application/use-cases/get-all-users.use-case';
import { UpdateUserUseCase } from './application/use-cases/update-user.use-case';
import { DeleteUserUseCase } from './application/use-cases/delete-user.use-case';
import { FindByEmailUserUseCase } from './application/use-cases/find-by-email-user.use-case';

// Token para la inyección de dependencias
export const USER_REPOSITORY = 'UserRepository';

@Module({
  imports: [
    ConfigModule.forRoot(),
  ],
  controllers: [UserController],
  providers: [
    // Repositorio
    {
      provide: USER_REPOSITORY,
      useClass: FirestoreUserRepository,
    },
    // Casos de uso
    {
      provide: CreateUserUseCase,
      useFactory: (userRepo) => new CreateUserUseCase(userRepo),
      inject: [USER_REPOSITORY],
    },
    {
      provide: GetUserByIdUseCase,
      useFactory: (userRepo) => new GetUserByIdUseCase(userRepo),
      inject: [USER_REPOSITORY],
    },
    {
      provide: GetAllUsersUseCase,
      useFactory: (userRepo) => new GetAllUsersUseCase(userRepo),
      inject: [USER_REPOSITORY],
    },
    {
      provide: UpdateUserUseCase,
      useFactory: (userRepo) => new UpdateUserUseCase(userRepo),
      inject: [USER_REPOSITORY],
    },
    {
      provide: DeleteUserUseCase,
      useFactory: (userRepo) => new DeleteUserUseCase(userRepo),
      inject: [USER_REPOSITORY],
    },
    {
      provide: FindByEmailUserUseCase,
      useFactory: (userRepo) => new FindByEmailUserUseCase(userRepo),
      inject: [USER_REPOSITORY],
    },
  ],
  exports: [USER_REPOSITORY],
})
export class UsersModule {} 