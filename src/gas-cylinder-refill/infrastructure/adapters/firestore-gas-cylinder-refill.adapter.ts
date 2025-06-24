import { GasCylinderRefill } from '../../domain/entities/gas-cylinder-refill.entity';
import { FirebaseDateAdapter } from '../../../shared/infrastructure/adapters/firebase-date.adapter';

export class FirestoreGasCylinderRefillAdapter {
  /**
   * Convierte datos de Firestore a una entidad GasCylinderRefill
   */
  public static toGasCylinderRefill(id: string, data: any): GasCylinderRefill {
    // Usar el adaptador para convertir las fechas de Firebase a DateTimeString
    const createdAt = FirebaseDateAdapter.toDateTimeString(data.createdAt);
    const updatedAt = FirebaseDateAdapter.toDateTimeString(data.updatedAt);
    const fillingTime = FirebaseDateAdapter.toDateTimeString(data.fillingTime);

    return new GasCylinderRefill(
      id,
      data.idGasCylinder,
      data.fillingPercentage,
      fillingTime,
      data.urlVoucher,
      createdAt,
      updatedAt
    );
  }

  /**
   * Convierte una entidad GasCylinderRefill a formato de datos para Firestore
   */
  public static toFirestoreData(gasCylinderRefill: GasCylinderRefill): any {
    return {
      idGasCylinder: gasCylinderRefill.idGasCylinder,
      fillingPercentage: gasCylinderRefill.fillingPercentage,
      fillingTime: gasCylinderRefill.fillingTime,
      urlVoucher: gasCylinderRefill.urlVoucher,
      createdAt: gasCylinderRefill.createdAt,
      updatedAt: gasCylinderRefill.updatedAt
    };
  }
} 