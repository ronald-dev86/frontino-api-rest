import { UniqueId, Percentage, DateTimeString } from '../../../shared/domain/types';

export class GasCylinderRefill {
  constructor(
    private readonly _id: UniqueId,
    private readonly _idGasCylinder: UniqueId,
    private _fillingPercentage: Percentage,
    private _fillingTime: DateTimeString,
    private _urlVoucher: string,
    private readonly _createdAt: DateTimeString,
    private _updatedAt: DateTimeString,
  ) {}

  get id(): UniqueId {
    return this._id;
  }

  get idGasCylinder(): UniqueId {
    return this._idGasCylinder;
  }

  get fillingPercentage(): Percentage {
    return this._fillingPercentage;
  }

  set fillingPercentage(fillingPercentage: Percentage) {
    this._fillingPercentage = fillingPercentage;
    this._updatedAt = new Date().toISOString();
  }

  get fillingTime(): DateTimeString {
    return this._fillingTime;
  }

  set fillingTime(fillingTime: DateTimeString) {
    this._fillingTime = fillingTime;
    this._updatedAt = new Date().toISOString();
  }

  get urlVoucher(): string {
    return this._urlVoucher;
  }

  set urlVoucher(urlVoucher: string) {
    this._urlVoucher = urlVoucher;
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
      idGasCylinder: this._idGasCylinder,
      fillingPercentage: this._fillingPercentage,
      fillingTime: this._fillingTime,
      urlVoucher: this._urlVoucher,
      createdAt: this._createdAt,
      updatedAt: this._updatedAt,
    };
  }
} 