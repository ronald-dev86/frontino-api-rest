import * as bcrypt from 'bcryptjs';
import { PasswordHashAdapter } from '../../../../src/users/infrastructure/adapters/password-hash.adapter';

// Mock de bcrypt para controlar su comportamiento
jest.mock('bcryptjs', () => ({
  hash: jest.fn(),
  compare: jest.fn()
}));

describe('PasswordHashAdapter', () => {
  let passwordHashAdapter: PasswordHashAdapter;
  
  beforeEach(() => {
    // Limpiar todos los mocks antes de cada test
    jest.clearAllMocks();
    passwordHashAdapter = new PasswordHashAdapter();
  });

  describe('hash', () => {
    it('debería hashear una contraseña correctamente', async () => {
      // Arrange
      const plainPassword = 'password123';
      const hashedPassword = 'hashed_password_123';
      
      // Configurar el mock de bcrypt.hash
      (bcrypt.hash as jest.Mock).mockResolvedValue(hashedPassword);
      
      // Act
      const result = await PasswordHashAdapter.hash(plainPassword);
      
      // Assert
      expect(result).toBe(hashedPassword);
      expect(bcrypt.hash).toHaveBeenCalledWith(plainPassword, PasswordHashAdapter['SALT_ROUNDS']);
    });

    it('debería hashear una contraseña usando la instancia del adaptador', async () => {
      // Arrange
      const plainPassword = 'password123';
      const hashedPassword = 'hashed_password_123';
      
      // Configurar el mock de bcrypt.hash
      (bcrypt.hash as jest.Mock).mockResolvedValue(hashedPassword);
      
      // Act
      const result = await passwordHashAdapter.hash(plainPassword);
      
      // Assert
      expect(result).toBe(hashedPassword);
      expect(bcrypt.hash).toHaveBeenCalledWith(plainPassword, PasswordHashAdapter['SALT_ROUNDS']);
    });
  });

  describe('compare', () => {
    it('debería comparar una contraseña correctamente', async () => {
      // Arrange
      const plainPassword = 'password123';
      const hashedPassword = 'hashed_password_123';
      
      // Configurar el mock de bcrypt.compare
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      
      // Act
      const result = await PasswordHashAdapter.compare(plainPassword, hashedPassword);
      
      // Assert
      expect(result).toBe(true);
      expect(bcrypt.compare).toHaveBeenCalledWith(plainPassword, hashedPassword);
    });

    it('debería comparar una contraseña usando la instancia del adaptador', async () => {
      // Arrange
      const plainPassword = 'password123';
      const hashedPassword = 'hashed_password_123';
      
      // Configurar el mock de bcrypt.compare
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      
      // Act
      const result = await passwordHashAdapter.compare(plainPassword, hashedPassword);
      
      // Assert
      expect(result).toBe(true);
      expect(bcrypt.compare).toHaveBeenCalledWith(plainPassword, hashedPassword);
    });

    it('debería devolver false para una contraseña incorrecta', async () => {
      // Arrange
      const plainPassword = 'wrong_password';
      const hashedPassword = 'hashed_password_123';
      
      // Configurar el mock de bcrypt.compare
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);
      
      // Act
      const result = await PasswordHashAdapter.compare(plainPassword, hashedPassword);
      
      // Assert
      expect(result).toBe(false);
      expect(bcrypt.compare).toHaveBeenCalledWith(plainPassword, hashedPassword);
    });
  });
}); 