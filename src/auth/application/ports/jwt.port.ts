/**
 * Puerto para la generación y verificación de tokens JWT
 */
export interface JwtService {
  /**
   * Genera un token JWT
   * @param payload - Datos a incluir en el token
   * @param expiresIn - Tiempo de expiración en segundos (por defecto 3600 = 1h)
   * @returns Token JWT generado
   */
  sign(payload: Record<string, any>, expiresIn?: number): string;

  /**
   * Verifica y decodifica un token JWT
   * @param token - Token JWT a verificar
   * @returns Payload decodificado o null si el token es inválido
   */
  verify(token: string): Record<string, any> | null;
} 