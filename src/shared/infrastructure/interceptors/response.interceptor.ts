import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  HttpStatus,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiResponse } from '../response/api-response';

@Injectable()
export class ResponseInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((data) => {
        // Si la respuesta ya es un ApiResponse, la devolvemos tal cual
        if (data && data instanceof ApiResponse) {
          return data;
        }

        // De lo contrario, formateamos la respuesta
        const response = context.switchToHttp().getResponse();
        const statusCode = response.statusCode || HttpStatus.OK;
        
        return ApiResponse.success('Operación exitosa', data, statusCode);
      })
    );
  }
} 