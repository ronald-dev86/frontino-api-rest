import { GasBill } from '../../domain/entities/gas-bill.entity';
import { DateTimeString } from '../../../shared/domain/types';

export interface GroupedGasBillsDto {
  time: DateTimeString;
  bills: GasBill[];
}
