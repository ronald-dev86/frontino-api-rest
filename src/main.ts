import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { AllExceptionsFilter, HttpExceptionFilter } from './shared/infrastructure/filters/http-exception.filter';
import { ResponseInterceptor } from './shared/infrastructure/interceptors/response.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Agregar prefijo global 'api/v1' a todos los endpoints
  app.setGlobalPrefix('api/v1');

  // Registrar filtros de excepciones globalmente
  app.useGlobalFilters(new HttpExceptionFilter(), new AllExceptionsFilter());

  // Registrar interceptor de respuesta global
  app.useGlobalInterceptors(new ResponseInterceptor());
  
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
