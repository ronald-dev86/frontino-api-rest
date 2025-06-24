import { Module } from '@nestjs/common';
import { ClientController } from './infrastructure/controllers/client.controller';
import { InMemoryClientRepository } from './infrastructure/repositories/in-memory-client.repository';
import { FirestoreClientRepository } from './infrastructure/repositories/firestore-client.repository';
import { CreateClientUseCase } from './application/use-cases/create-client.use-case';
import { GetAllClientsUseCase } from './application/use-cases/get-all-clients.use-case';
import { GetClientByIdUseCase } from './application/use-cases/get-client-by-id.use-case';
import { UpdateClientUseCase } from './application/use-cases/update-client.use-case';
import { DeleteClientUseCase } from './application/use-cases/delete-client.use-case';
import { ConfigModule } from '@nestjs/config';

// Token para la inyección de dependencias
export const CLIENT_REPOSITORY = 'CLIENT_REPOSITORY';

@Module({
  imports: [
    ConfigModule.forRoot(),
  ],
  controllers: [ClientController],
  providers: [
    // Repositorios
    {
      provide: CLIENT_REPOSITORY,
      useClass: FirestoreClientRepository,
    },
    // Casos de uso
    {
      provide: CreateClientUseCase,
      useFactory: (clientRepo) => new CreateClientUseCase(clientRepo),
      inject: [CLIENT_REPOSITORY],
    },
    {
      provide: GetAllClientsUseCase,
      useFactory: (clientRepo) => new GetAllClientsUseCase(clientRepo),
      inject: [CLIENT_REPOSITORY],
    },
    {
      provide: GetClientByIdUseCase,
      useFactory: (clientRepo) => new GetClientByIdUseCase(clientRepo),
      inject: [CLIENT_REPOSITORY],
    },
    {
      provide: UpdateClientUseCase,
      useFactory: (clientRepo) => new UpdateClientUseCase(clientRepo),
      inject: [CLIENT_REPOSITORY],
    },
    {
      provide: DeleteClientUseCase,
      useFactory: (clientRepo) => new DeleteClientUseCase(clientRepo),
      inject: [CLIENT_REPOSITORY],
    },
  ],
  exports: [CLIENT_REPOSITORY],
})
export class ClientsModule {} 