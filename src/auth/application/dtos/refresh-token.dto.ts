import { UniqueId } from '../../../shared/domain/types';

export class RefreshTokenDto {
  oldToken: string;
  idUser: UniqueId;
} 