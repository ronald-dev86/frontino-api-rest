import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Agregar prefijo global 'api/v1' a todos los endpoints
  app.setGlobalPrefix('api/v1');
  
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
