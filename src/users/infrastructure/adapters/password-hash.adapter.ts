import * as bcrypt from 'bcryptjs';
import { PasswordHash } from '../../application/ports/password-hash.port';

/**
 * Adaptador para manejar el hash de contraseñas
 */
export class PasswordHashAdapter implements PasswordHash {
  private static readonly SALT_ROUNDS = 10;

  /**
   * Hashea una contraseña utilizando bcrypt
   * @param plainPassword - La contraseña en texto plano
   * @returns La contraseña hasheada
   */
  static async hash(plainPassword: string): Promise<string> {
    return bcrypt.hash(plainPassword, this.SALT_ROUNDS);
  }

  /**
   * Verifica si una contraseña coincide con un hash
   * @param plainPassword - La contraseña en texto plano
   * @param hashedPassword - El hash de la contraseña almacenado
   * @returns true si la contraseña coincide, false en caso contrario
   */
  static async compare(plainPassword: string, hashedPassword: string): Promise<boolean> {
    return bcrypt.compare(plainPassword, hashedPassword);
  }

  /**
   * Implementación del puerto PasswordHash
   */
  async hash(plainPassword: string): Promise<string> {
    return PasswordHashAdapter.hash(plainPassword);
  }

  /**
   * Implementación del puerto PasswordHash
   */
  async compare(plainPassword: string, hashedPassword: string): Promise<boolean> {
    return PasswordHashAdapter.compare(plainPassword, hashedPassword);
  }
} 