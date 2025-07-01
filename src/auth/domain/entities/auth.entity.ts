import { UniqueId, DateTimeString } from '../../../shared/domain/types';

export class Auth {
  constructor(
    private readonly _id: UniqueId,
    private readonly _idUser: UniqueId,
    private _token: string,
    private readonly _createdAt: DateTimeString,
  ) {}

  get id(): UniqueId {
    return this._id;
  }

  get idUser(): UniqueId {
    return this._idUser;
  }

  get token(): string {
    return this._token;
  }

  set token(token: string) {
    this._token = token;
  }

  get createdAt(): DateTimeString {
    return this._createdAt;
  }

  toJSON() {
    return {
      idUser: this._idUser,
      token: this._token,
      createdAt: this._createdAt,
    };
  }
}
