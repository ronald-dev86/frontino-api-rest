import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { AllExceptionsFilter, HttpExceptionFilter } from './shared/infrastructure/filters/http-exception.filter';
import { ResponseInterceptor } from './shared/infrastructure/interceptors/response.interceptor';
import { initializeFirebase } from './config/firebase-config';

async function bootstrap() {
  // Inicializar Firebase antes de crear la aplicación
  initializeFirebase();
  
  const app = await NestFactory.create(AppModule);
  
  // Habilitar CORS para permitir solicitudes desde el frontend
  app.enableCors({
    origin: true, // Permite cualquier origen (cambiar para producción)
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE', // Métodos permitidos
    credentials: true, // Permite el envío de cookies y cabeceras de autorización
  });

  // Agregar prefijo global 'api/v1' a todos los endpoints
  app.setGlobalPrefix('api/v1');

  // Registrar filtros de excepciones globalmente
  app.useGlobalFilters(new HttpExceptionFilter(), new AllExceptionsFilter());

  // Registrar interceptor de respuesta global
  app.useGlobalInterceptors(new ResponseInterceptor());
  
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
