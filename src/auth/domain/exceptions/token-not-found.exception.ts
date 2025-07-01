export class TokenNotFoundException extends Error {
  constructor(token: string) {
    super(`Token ${token.substring(0, 10)}... no encontrado`);
    this.name = 'TokenNotFoundException';
  }
} 