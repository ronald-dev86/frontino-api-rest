import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ClientsModule } from './clients/clients.module';
import { ConfigModule } from '@nestjs/config';
import { GasCylinderRefillModule } from './gas-cylinder-refill/gas-cylinder-refill.module';
import { MembersModule } from './members/members.module';
import { GasBillModule } from './gas-bill/gas-bill.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { LoggerMiddleware } from './shared/infrastructure/middleware/logger.middleware';
import { StorageModule } from './storage/storage.module';

@Module({
  imports: [
    // Cargar variables de entorno
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ClientsModule,
    GasCylinderRefillModule,
    MembersModule,
    GasBillModule,
    UsersModule,
    AuthModule,
    StorageModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(LoggerMiddleware)
      .forRoutes('users', 'clients', 'storage');
  }
}
