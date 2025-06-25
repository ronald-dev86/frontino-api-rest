import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { GasBillController } from './infrastructure/controllers/gas-bill.controller';
import { FirestoreGasBillRepository } from './infrastructure/repositories/firestore-gas-bill.repository';
import { InMemoryGasBillRepository } from './infrastructure/repositories/in-memory-gas-bill.repository';
import { SaveGasBillUseCase } from './application/use-cases/save-gas-bill.use-case';
import { GetGasBillByIdUseCase } from './application/use-cases/get-gas-bill-by-id.use-case';
import { GetAllGasBillsUseCase } from './application/use-cases/get-all-gas-bills.use-case';
import { UpdateGasBillUseCase } from './application/use-cases/update-gas-bill.use-case';
import { DeleteGasBillUseCase } from './application/use-cases/delete-gas-bill.use-case';
import { FindByTimeAndMemberUseCase } from './application/use-cases/find-by-time-and-member.use-case';
import { FindInIdsMembersUseCase } from './application/use-cases/find-in-ids-members.use-case';

// Token para la inyección de dependencias
export const GAS_BILL_REPOSITORY = 'GasBillRepository';

@Module({
  imports: [
    ConfigModule.forRoot(),
  ],
  controllers: [GasBillController],
  providers: [
    // Repositorio
    {
      provide: GAS_BILL_REPOSITORY,
      useClass: FirestoreGasBillRepository,
    },
    // Casos de uso
    {
      provide: SaveGasBillUseCase,
      useFactory: (gasBillRepo) => new SaveGasBillUseCase(gasBillRepo),
      inject: [GAS_BILL_REPOSITORY],
    },
    {
      provide: GetAllGasBillsUseCase,
      useFactory: (gasBillRepo) => new GetAllGasBillsUseCase(gasBillRepo),
      inject: [GAS_BILL_REPOSITORY],
    },
    {
      provide: GetGasBillByIdUseCase,
      useFactory: (gasBillRepo) => new GetGasBillByIdUseCase(gasBillRepo),
      inject: [GAS_BILL_REPOSITORY],
    },
    {
      provide: UpdateGasBillUseCase,
      useFactory: (gasBillRepo) => new UpdateGasBillUseCase(gasBillRepo),
      inject: [GAS_BILL_REPOSITORY],
    },
    {
      provide: DeleteGasBillUseCase,
      useFactory: (gasBillRepo) => new DeleteGasBillUseCase(gasBillRepo),
      inject: [GAS_BILL_REPOSITORY],
    },
    {
      provide: FindByTimeAndMemberUseCase,
      useFactory: (gasBillRepo) => new FindByTimeAndMemberUseCase(gasBillRepo),
      inject: [GAS_BILL_REPOSITORY],
    },
    {
      provide: FindInIdsMembersUseCase,
      useFactory: (gasBillRepo) => new FindInIdsMembersUseCase(gasBillRepo),
      inject: [GAS_BILL_REPOSITORY],
    },
  ],
  exports: [GAS_BILL_REPOSITORY],
})
export class GasBillModule {} 