/**
 * Puerto para el hash de contraseñas
 */
export interface PasswordHash {
  /**
   * Hashea una contraseña
   * @param plainPassword - La contraseña en texto plano
   * @returns La contraseña hasheada
   */
  hash(plainPassword: string): Promise<string>;

  /**
   * Verifica si una contraseña coincide con un hash
   * @param plainPassword - La contraseña en texto plano
   * @param hashedPassword - El hash de la contraseña almacenado
   * @returns true si la contraseña coincide, false en caso contrario
   */
  compare(plainPassword: string, hashedPassword: string): Promise<boolean>;
} 