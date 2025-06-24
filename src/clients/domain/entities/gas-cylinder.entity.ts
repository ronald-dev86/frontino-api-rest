import { UniqueId, DateTimeString, Gal, Lts } from '../../../shared/domain/types';

export class GasCylinder {
  constructor(
    private readonly _id: UniqueId,
    private _glMax: Gal,
    private _glToLts: Lts,
  ) {}

  get id(): UniqueId {
    return this._id;
  }

  get glMax(): Gal {
    return this._glMax;
  }

  set glMax(glMax: Gal) {
    this._glMax = glMax;
  }

  get glToLts(): Lts {
    return this._glToLts;
  }

  set glToLts(glToLts: Lts) {
    this._glToLts = glToLts;
  }

  toJSON() {
    return {
      id: this._id,
      glMax: this._glMax,
      glToLts: this._glToLts,
    };
  }
} 