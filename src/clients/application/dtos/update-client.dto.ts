import { ClientType } from '../../domain/enums/client-type.enum';
import { MembershipType } from '../../domain/enums/membership-type.enum';
import { GasCylinder } from '../../domain/entities/gas-cylinder.entity';
import { UniqueName } from '../../../shared/domain/types';
import { Agent } from '../../domain/entities/agent.entity';

export class UpdateClientDto {
  name?: UniqueName;
  agent?: {
    name: string;
    contactNumber: string;
  };
  active?: boolean;
  phone?: string;
  type?: ClientType;
  membership?: MembershipType;
  gasCylinders?: GasCylinder[];
} 