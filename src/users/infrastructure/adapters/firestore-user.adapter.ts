import { User } from '../../domain/entities/user.entity';
import { FirebaseDateAdapter } from '../../../shared/infrastructure/adapters/firebase-date.adapter';
import { Roles } from '../../domain/enums/roles.enum';

export class FirestoreUserAdapter {
  static toFirestore(user: User): Record<string, any> {
    return {
      id: user.id,
      idAssociatedAccounts: user.idAssociatedAccounts,
      email: user.email,
      password: user.password,
      rol: user.rol,
      active: user.active,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }

  static fromFirestore(data: FirebaseFirestore.DocumentData): User {
    return User.create(
      data.id,
      data.idAssociatedAccounts || [],
      data.email,
      data.password,
      data.rol as Roles,
      data.active !== undefined ? data.active : true,
      FirebaseDateAdapter.toDateTimeString(data.createdAt),
      FirebaseDateAdapter.toDateTimeString(data.updatedAt),
    );
  }
} 