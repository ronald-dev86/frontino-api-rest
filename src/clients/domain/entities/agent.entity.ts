export class Agent {
  constructor(
    private _name: string,
    private _contactNumber: string,
  ) {}

  get name(): string {
    return this._name;
  }

  set name(name: string) {
    this._name = name;
  }

  get contactNumber(): string {
    return this._contactNumber;
  }

  set contactNumber(contactNumber: string) {
    this._contactNumber = contactNumber;
  }

  toJSON() {
    return {
      name: this._name,
      contactNumber: this._contactNumber,
    };
  }
} 