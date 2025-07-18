import { UniqueId, DateTimeString } from '../../../shared/domain/types';
import { Roles } from '../enums/roles.enum';

export class User {
  constructor(
    private readonly _id: UniqueId,
    private _idAssociatedAccounts: UniqueId[],
    private _email: string,
    private _password: string,
    private _rol: Roles,
    private _active: boolean,
    private readonly _createdAt: DateTimeString,
    private _updatedAt: DateTimeString,
  ) {}

  get id(): UniqueId {
    return this._id;
  }

  get idAssociatedAccounts(): UniqueId[] {
    return this._idAssociatedAccounts;
  }

  set idAssociatedAccounts(idAssociatedAccounts: UniqueId[]) {
    this._idAssociatedAccounts = idAssociatedAccounts;
    this._updatedAt = new Date().toISOString();
  }

  get email(): string {
    return this._email;
  }

  set email(email: string) {
    this._email = email;
    this._updatedAt = new Date().toISOString();
  }

  get password(): string {
    return this._password;
  }

  set password(password: string) {
    this._password = password;
    this._updatedAt = new Date().toISOString();
  }

  get rol(): Roles {
    return this._rol;
  }

  set rol(rol: Roles) {
    this._rol = rol;
    this._updatedAt = new Date().toISOString();
  }

  get active(): boolean {
    return this._active;
  }

  set active(active: boolean) {
    this._active = active;
    this._updatedAt = new Date().toISOString();
  }

  get createdAt(): DateTimeString {
    return this._createdAt;
  }

  get updatedAt(): DateTimeString {
    return this._updatedAt;
  }

  toJSON() {
    return {
      id: this._id,
      idAssociatedAccounts: this._idAssociatedAccounts,
      email: this._email,
      password: this._password,
      rol: this._rol,
      active: this._active,
      createdAt: this._createdAt,
      updatedAt: this._updatedAt,
    };
  }
} 