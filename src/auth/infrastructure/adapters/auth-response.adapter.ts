import { Injectable } from '@nestjs/common';
import { Auth } from '../../domain/entities/auth.entity';

// DTO para la respuesta de autenticación sin el ID
export interface AuthResponseDto {
  idUser: string;
  token: string;
  createdAt: string;
}

/**
 * Adaptador para transformar entidades Auth en DTOs de respuesta
 * Siguiendo el principio de responsabilidad única (SRP), este adaptador
 * se encarga exclusivamente de la transformación de datos entre la capa de dominio
 * y la capa de presentación.
 */
@Injectable()
export class AuthResponseAdapter {
  /**
   * Transforma una entidad Auth a un DTO de respuesta sin el ID
   * @param auth - Entidad de autenticación
   * @returns DTO de respuesta sin el ID
   */
  static toResponseDto(auth: Auth): AuthResponseDto {
    return {
      idUser: auth.idUser,
      token: auth.token,
      createdAt: auth.createdAt
    };
  }
} 