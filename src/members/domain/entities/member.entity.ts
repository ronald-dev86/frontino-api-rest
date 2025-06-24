import { UniqueId, DateTimeString, Email } from '../../../shared/domain/types';

export class Member {
  constructor(
    private readonly _id: UniqueId,
    private readonly _idClient: UniqueId,
    private _name: string,
    private _lastname: string,
    private _email: Email,
    private _phone: string,
    private _address: string,
    private _meterSerial: string,
    private _active: boolean,
    private readonly _createdAt: DateTimeString,
    private _updatedAt: DateTimeString,
  ) {}

  get id(): UniqueId {
    return this._id;
  }

  get idClient(): UniqueId {
    return this._idClient;
  }

  get name(): string {
    return this._name;
  }

  set name(name: string) {
    this._name = name;
    this._updatedAt = new Date().toISOString();
  }

  get lastname(): string {
    return this._lastname;
  }

  set lastname(lastname: string) {
    this._lastname = lastname;
    this._updatedAt = new Date().toISOString();
  }

  get email(): Email {
    return this._email;
  }

  set email(email: Email) {
    console.log(email);
    this._email = email;
    this._updatedAt = new Date().toISOString();
  }

  get phone(): string {
    return this._phone;
  }

  set phone(phone: string) {
    this._phone = phone;
    this._updatedAt = new Date().toISOString();
  }

  get address(): string {
    return this._address;
  }

  set address(address: string) {
    this._address = address;
    this._updatedAt = new Date().toISOString();
  }

  get meterSerial(): string {
    return this._meterSerial;
  }

  set meterSerial(meterSerial: string) {
    this._meterSerial = meterSerial;
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
      idClient: this._idClient,
      name: this._name,
      lastname: this._lastname,
      email: this._email,
      phone: this._phone,
      address: this._address,
      meterSerial: this._meterSerial,
      active: this._active,
      createdAt: this._createdAt,
      updatedAt: this._updatedAt,
    };
  }
} 