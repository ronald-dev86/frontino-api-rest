import { Auth } from '../../domain/entities/auth.entity';
import { FirebaseDateAdapter } from '../../../shared/infrastructure/adapters/firebase-date.adapter';

export class FirestoreAuthAdapter {
  static toFirestore(auth: Auth): Record<string, any> {
    return {
      id: auth.id,
      idUser: auth.idUser,
      token: auth.token,
      createdAt: auth.createdAt,
    };
  }

  static fromFirestore(data: FirebaseFirestore.DocumentData): Auth {
    return new Auth(
      data.id,
      data.idUser,
      data.token,
      FirebaseDateAdapter.toDateTimeString(data.createdAt),
    );
  }
} 