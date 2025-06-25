import { UniqueId, DateTimeString } from '../../../shared/domain/types';

export class GasBill {
  constructor(
    private readonly _id: UniqueId,
    private readonly _idMember: UniqueId,
    private readonly _time: DateTimeString,
    private _m3: number,
    private _urlPhoto: string,
    private readonly _createdAt: DateTimeString,
    private _updatedAt: DateTimeString,
  ) {}

  get id(): UniqueId {
    return this._id;
  }

  get idMember(): UniqueId {
    return this._idMember;
  }

  get time(): DateTimeString {
    return this._time;
  }

  get m3(): number {
    return this._m3;
  }

  set m3(m3: number) {
    this._m3 = m3;
    this._updatedAt = new Date().toISOString();
  }

  get urlPhoto(): string {
    return this._urlPhoto;
  }

  set urlPhoto(urlPhoto: string) {
    this._urlPhoto = urlPhoto;
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
      idMember: this._idMember,
      time: this._time,
      m3: this._m3,
      urlPhoto: this._urlPhoto,
      createdAt: this._createdAt,
      updatedAt: this._updatedAt,
    };
  }
} 