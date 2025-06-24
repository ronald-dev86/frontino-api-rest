export class DuplicateMeterSerialException extends Error {
  constructor(meterSerial: string) {
    super(`Ya existe un miembro con el número de serie de medidor: ${meterSerial}`);
    this.name = 'DuplicateMeterSerialException';
  }
} 