import { UniqueId } from '../../../shared/domain/types';

export class CreateAuthDto {
  idUser: UniqueId;
  token: string;
} 