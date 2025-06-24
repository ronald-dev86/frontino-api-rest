import { Module } from '@nestjs/common';
import { GasCylinderRefillController } from './infrastructure/controllers/gas-cylinder-refill.controller';
import { CreateGasCylinderRefillUseCase } from './application/use-cases/create-gas-cylinder-refill.use-case';
import { GetAllGasCylinderRefillsUseCase } from './application/use-cases/get-all-gas-cylinder-refills.use-case';
import { GetGasCylinderRefillByIdUseCase } from './application/use-cases/get-gas-cylinder-refill-by-id.use-case';
import { GetGasCylinderRefillsByCylinderIdUseCase } from './application/use-cases/get-gas-cylinder-refills-by-cylinder-id.use-case';
import { UpdateGasCylinderRefillUseCase } from './application/use-cases/update-gas-cylinder-refill.use-case';
import { DeleteGasCylinderRefillUseCase } from './application/use-cases/delete-gas-cylinder-refill.use-case';
import { FirestoreGasCylinderRefillRepository } from './infrastructure/repositories/firestore-gas-cylinder-refill.repository';
import { InMemoryGasCylinderRefillRepository } from './infrastructure/repositories/in-memory-gas-cylinder-refill.repository';
import { ConfigModule } from '@nestjs/config';

// Token de inyección de dependencias para el repositorio
export const GAS_CYLINDER_REFILL_REPOSITORY = 'GAS_CYLINDER_REFILL_REPOSITORY';

@Module({
  imports: [
    ConfigModule.forRoot(),
  ],
  controllers: [GasCylinderRefillController],
  providers: [
    // Repositorios
    {
      provide: GAS_CYLINDER_REFILL_REPOSITORY,
      useClass: FirestoreGasCylinderRefillRepository,
    },
    
    // Casos de uso
    {
      provide: CreateGasCylinderRefillUseCase,
      useFactory: (refillRepo) => new CreateGasCylinderRefillUseCase(refillRepo),
      inject: [GAS_CYLINDER_REFILL_REPOSITORY],
    },
    {
      provide: GetAllGasCylinderRefillsUseCase,
      useFactory: (refillRepo) => new GetAllGasCylinderRefillsUseCase(refillRepo),
      inject: [GAS_CYLINDER_REFILL_REPOSITORY],
    },
    {
      provide: GetGasCylinderRefillByIdUseCase,
      useFactory: (refillRepo) => new GetGasCylinderRefillByIdUseCase(refillRepo),
      inject: [GAS_CYLINDER_REFILL_REPOSITORY],
    },
    {
      provide: GetGasCylinderRefillsByCylinderIdUseCase,
      useFactory: (refillRepo) => new GetGasCylinderRefillsByCylinderIdUseCase(refillRepo),
      inject: [GAS_CYLINDER_REFILL_REPOSITORY],
    },
    {
      provide: UpdateGasCylinderRefillUseCase,
      useFactory: (refillRepo) => new UpdateGasCylinderRefillUseCase(refillRepo),
      inject: [GAS_CYLINDER_REFILL_REPOSITORY],
    },
    {
      provide: DeleteGasCylinderRefillUseCase,
      useFactory: (refillRepo) => new DeleteGasCylinderRefillUseCase(refillRepo),
      inject: [GAS_CYLINDER_REFILL_REPOSITORY],
    },
  ],
  exports: [GAS_CYLINDER_REFILL_REPOSITORY],
})
export class GasCylinderRefillModule {} 