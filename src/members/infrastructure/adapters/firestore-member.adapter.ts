import { Member } from '../../domain/entities/member.entity';
import { Email } from '../../domain/value-objects/email.value-object';
import { FirebaseDateAdapter } from '../../../shared/infrastructure/adapters/firebase-date.adapter';

export class FirestoreMemberAdapter {
  /**
   * Convierte datos de Firestore a una entidad Member
   */
  public static toMember(id: string, data: any): Member {
    // Crear el objeto Email
    const email = new Email(data.email);

    // Usar el adaptador para convertir las fechas de Firebase a DateTimeString
    const createdAt = FirebaseDateAdapter.toDateTimeString(data.createdAt);
    const updatedAt = FirebaseDateAdapter.toDateTimeString(data.updatedAt);

    return new Member(
      id,
      data.idClient,
      data.name,
      data.lastname,
      email,
      data.phone,
      data.address,
      data.meterSerial,
      data.active,
      createdAt,
      updatedAt
    );
  }

  /**
   * Convierte una entidad Member a formato de datos para Firestore
   */
  public static toFirestoreData(member: Member): any {
    return {
      idClient: member.idClient,
      name: member.name,
      lastname: member.lastname,
      email: member.email.value,
      phone: member.phone,
      address: member.address,
      meterSerial: member.meterSerial,
      active: member.active,
      createdAt: member.createdAt,
      updatedAt: member.updatedAt
    };
  }
} 