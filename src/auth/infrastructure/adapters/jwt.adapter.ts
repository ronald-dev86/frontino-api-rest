import { JwtService } from '../../application/ports/jwt.port';
import * as jwt from 'jsonwebtoken';
import { SignOptions } from 'jsonwebtoken';
import { Injectable } from '@nestjs/common';

@Injectable()
export class JwtAdapter implements JwtService {
  private readonly secretKey: string;

  constructor() {
    // En un caso real, esto debería venir de variables de entorno
    this.secretKey = process.env.JWT_SECRET || 'frontino-secret-key';
  }

  /**
   * Genera un token JWT
   * @param payload - Datos a incluir en el token
   * @param expiresIn - Tiempo de expiración en segundos (por defecto 3600 = 1h)
   * @returns Token JWT generado
   */
  sign(payload: Record<string, any>, expiresIn: number = 3600000): string {
    try {
      return jwt.sign(payload, this.secretKey, { expiresIn });
    } catch (error) {
      console.error('Error al firmar token JWT:', error);
      throw new Error('Error al generar token JWT');
    }
  }

  /**
   * Verifica y decodifica un token JWT
   * @param token - Token JWT a verificar
   * @returns Payload decodificado o null si el token es inválido
   */
  verify(token: string): Record<string, any> | null {
    try {
      return jwt.verify(token, this.secretKey) as Record<string, any>;
    } catch (error) {
      console.error('Error al verificar token JWT:', error);
      return null;
    }
  }
} 