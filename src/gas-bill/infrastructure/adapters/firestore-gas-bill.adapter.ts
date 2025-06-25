import { GasBill } from '../../domain/entities/gas-bill.entity';
import { FirebaseDateAdapter } from '../../../shared/infrastructure/adapters/firebase-date.adapter';

export class FirestoreGasBillAdapter {
  /**
   * Convierte datos de Firestore a una entidad GasBill
   */
  public static toGasBill(id: string, data: any): GasBill {
    // Usar el adaptador para convertir las fechas de Firebase a DateTimeString
    const time = FirebaseDateAdapter.toDateTimeString(data.time);
    const createdAt = FirebaseDateAdapter.toDateTimeString(data.createdAt);
    const updatedAt = FirebaseDateAdapter.toDateTimeString(data.updatedAt);

    return new GasBill(
      id,
      data.idMember,
      time,
      data.m3,
      data.urlPhoto,
      createdAt,
      updatedAt
    );
  }

  /**
   * Convierte una entidad GasBill a formato de datos para Firestore
   */
  public static toFirestoreData(gasBill: GasBill): any {
    return {
      idMember: gasBill.idMember,
      time: gasBill.time,
      m3: gasBill.m3,
      urlPhoto: gasBill.urlPhoto,
      createdAt: gasBill.createdAt,
      updatedAt: gasBill.updatedAt
    };
  }
} 