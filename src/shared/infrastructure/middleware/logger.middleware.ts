import { Injectable, NestMiddleware, UnauthorizedException } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express'

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    console.log('Request...');
    
    // Validar que la solicitud tenga un token de autorización
    const authHeader = req.headers.authorization;
    
    if (!authHeader) {
      console.log('Solicitud sin token de autorización');
      throw new UnauthorizedException('Token de autorización requerido');
    }
    
    // Verificar formato del token (Bearer [token])
    const tokenParts = authHeader.split(' ');
    if (tokenParts.length !== 2 || tokenParts[0] !== 'Bearer') {
      console.log('Formato de token inválido');
      throw new UnauthorizedException('Formato de token inválido');
    }
    
    console.log('Token presente en la solicitud');
    next();
  }
}