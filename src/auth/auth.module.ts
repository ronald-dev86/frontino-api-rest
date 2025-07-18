import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from '../users/users.module';
import { PasswordHash } from '../users/application/ports/password-hash.port';
import { PASSWORD_HASH, USER_REPOSITORY } from '../users/users.module';
import { AuthController } from './infrastructure/controllers/auth.controller';
import { FirestoreAuthRepository } from './infrastructure/repositories/firestore-auth.repository';
import { CreateAuthUseCase } from './application/use-cases/create-auth.use-case';
import { GetAuthByIdUseCase } from './application/use-cases/get-auth-by-id.use-case';
import { FindByTokenAuthUseCase } from './application/use-cases/find-by-token-auth.use-case';
import { UpdateAuthUseCase } from './application/use-cases/update-auth.use-case';
import { DeleteAuthUseCase } from './application/use-cases/delete-auth.use-case';
import { LoginUseCase } from './application/use-cases/login.use-case';
import { LogoutUseCase } from './application/use-cases/logout.use-case';
import { RefreshTokenUseCase } from './application/use-cases/refresh-token.use-case';
import { ResetPasswordUseCase } from './application/use-cases/reset-password.use-case';
import { JwtAdapter } from '../shared/infrastructure/adapters/jwt.adapter';
import { JwtService } from '../shared/application/ports/jwt.port';
import { AuthResponseAdapter } from './infrastructure/adapters/auth-response.adapter';

// Token para la inyección de dependencias
export const AUTH_REPOSITORY = 'AUTH_REPOSITORY';
export const JWT_SERVICE = 'JWT_SERVICE';

@Module({
  imports: [
    ConfigModule.forRoot(),
    UsersModule, // Importamos el módulo de usuarios para usar sus servicios
  ],
  controllers: [
    AuthController
  ],
  providers: [
    // Servicios
    {
      provide: JWT_SERVICE,
      useClass: JwtAdapter,
    },
    // Adaptadores
    AuthResponseAdapter,
    // Repositorios
    {
      provide: AUTH_REPOSITORY,
      useClass: FirestoreAuthRepository,
    },
    // Casos de uso
    {
      provide: CreateAuthUseCase,
      useFactory: (authRepo) => new CreateAuthUseCase(authRepo),
      inject: [AUTH_REPOSITORY],
    },
    {
      provide: GetAuthByIdUseCase,
      useFactory: (authRepo) => new GetAuthByIdUseCase(authRepo),
      inject: [AUTH_REPOSITORY],
    },
    {
      provide: FindByTokenAuthUseCase,
      useFactory: (authRepo) => new FindByTokenAuthUseCase(authRepo),
      inject: [AUTH_REPOSITORY],
    },
    {
      provide: UpdateAuthUseCase,
      useFactory: (authRepo) => new UpdateAuthUseCase(authRepo),
      inject: [AUTH_REPOSITORY],
    },
    {
      provide: DeleteAuthUseCase,
      useFactory: (authRepo) => new DeleteAuthUseCase(authRepo),
      inject: [AUTH_REPOSITORY],
    },
    {
      provide: LoginUseCase,
      useFactory: (authRepo, userRepo, passwordHash, jwtService) => 
        new LoginUseCase(authRepo, userRepo, passwordHash, jwtService),
      inject: [AUTH_REPOSITORY, USER_REPOSITORY, PASSWORD_HASH, JWT_SERVICE],
    },
    {
      provide: LogoutUseCase,
      useFactory: (authRepo) => new LogoutUseCase(authRepo),
      inject: [AUTH_REPOSITORY],
    },
    {
      provide: RefreshTokenUseCase,
      useFactory: (authRepo, jwtService) => new RefreshTokenUseCase(authRepo, jwtService),
      inject: [AUTH_REPOSITORY, JWT_SERVICE],
    },
    {
      provide: ResetPasswordUseCase,
      useFactory: (userRepo, passwordHash) => 
        new ResetPasswordUseCase(userRepo, passwordHash),
      inject: [USER_REPOSITORY, PASSWORD_HASH],
    },
  ],
  exports: [AUTH_REPOSITORY, JWT_SERVICE],
})
export class AuthModule {} 