import { ClientType } from '../../domain/enums/client-type.enum';
import { MembershipType } from '../../domain/enums/membership-type.enum';
import { UniqueName } from '../../../shared/domain/types';

// DTO para cilindros de gas (sin ID)
export class GasCylinderDTO {
  glMax: number;
  glToLts: number;
}

export class CreateClientDto {
  name: UniqueName;
  agent: {
    name: string;
    contactNumber: string;
  };
  active: boolean;
  phone: string;
  type: ClientType;
  membership: MembershipType;
  gasCylinders?: GasCylinderDTO[];
} 