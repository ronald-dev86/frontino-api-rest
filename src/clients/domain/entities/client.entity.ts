import { UniqueId, UniqueName, DateTimeString } from '../../../shared/domain/types';
import { ClientType } from '../enums/client-type.enum';
import { MembershipType } from '../enums/membership-type.enum';
import { GasCylinder } from './gas-cylinder.entity';
import { Agent } from './agent.entity';

export class Client {
  constructor(
    private readonly _id: UniqueId,
    private _name: UniqueName,
    private _agent: Agent,
    private _active: boolean,
    private _phone: string,
    private _type: ClientType,
    private _membership: MembershipType,
    private _gasCylinders: GasCylinder[],
    private readonly _createdAt: DateTimeString,
    private _updatedAt: DateTimeString,
  ) {}

  get id(): UniqueId {
    return this._id;
  }

  get name(): UniqueName {
    return this._name;
  }

  set name(name: UniqueName) {
    this._name = name;
    this._updatedAt = new Date().toISOString();
  }

  get agent(): Agent {
    return this._agent;
  }

  set agent(agent: Agent) {
    this._agent = agent;
    this._updatedAt = new Date().toISOString();
  }

  get active(): boolean {
    return this._active;
  }

  set active(active: boolean) {
    this._active = active;
    this._updatedAt = new Date().toISOString();
  }

  get phone(): string {
    return this._phone;
  }

  set phone(phone: string) {
    this._phone = phone;
    this._updatedAt = new Date().toISOString();
  }

  get type(): ClientType {
    return this._type;
  }

  set type(type: ClientType) {
    this._type = type;
    this._updatedAt = new Date().toISOString();
  }

  get membership(): MembershipType {
    return this._membership;
  }

  set membership(membership: MembershipType) {
    this._membership = membership;
    this._updatedAt = new Date().toISOString();
  }

  get gasCylinders(): GasCylinder[] {
    return [...this._gasCylinders];
  }

  addGasCylinder(gasCylinder: GasCylinder): void {
    this._gasCylinders.push(gasCylinder);
    this._updatedAt = new Date().toISOString();
  }

  removeGasCylinder(cylinderId: UniqueId): void {
    this._gasCylinders = this._gasCylinders.filter(
      (cylinder) => cylinder.id !== cylinderId
    );
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
      name: this._name,
      agent: this._agent.toJSON(),
      active: this._active,
      phone: this._phone,
      type: this._type,
      membership: this._membership,
      gasCylinders: this._gasCylinders.map(cylinder => cylinder.toJSON()),
      createdAt: this._createdAt,
      updatedAt: this._updatedAt,
    };
  }
} 