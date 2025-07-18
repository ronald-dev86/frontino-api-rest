import {
  Injectable,
  NestMiddleware,
  Inject,
  UnauthorizedException,
} from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { JwtService } from '../../application/ports/jwt.port';
import { JWT_SERVICE } from '../../../auth/auth.module';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  constructor(
    @Inject(JWT_SERVICE)
    private readonly jwtService: JwtService
  ) {}

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
    const token = tokenParts[1];
    // Verificar el token JWT usando JwtService
    const payload = this.jwtService.verify(token);
    if (!payload) {
      console.log('Token JWT inválido');
      throw new UnauthorizedException('Token JWT inválido');
    }
    // Puedes adjuntar el payload al request si lo necesitas
    // req["user"] = payload;
    console.log('Token válido, payload:', payload);
    next();
  }
}