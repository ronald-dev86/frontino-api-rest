import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ClientsModule } from './clients/clients.module';
import { ConfigModule } from '@nestjs/config';
import { GasCylinderRefillModule } from './gas-cylinder-refill/gas-cylinder-refill.module';
import { MembersModule } from './members/members.module';

@Module({
  imports: [
    // Cargar variables de entorno
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ClientsModule,
    GasCylinderRefillModule,
    MembersModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
