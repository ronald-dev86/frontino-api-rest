/**
 * Adaptador para convertir entre formatos de fecha de Firebase y dominio
 */
export class FirebaseDateAdapter {
  /**
   * Convierte un Timestamp de Firebase a una cadena ISO (DateTimeString)
   * @param firebaseTimestamp - El timestamp de Firebase ({_seconds: number, _nanoseconds: number})
   * @returns Una cadena ISO que representa la fecha
   */
  static toDateTimeString(firebaseTimestamp: any): string {
    // Si ya es un string, devolverlo directamente
    if (typeof firebaseTimestamp === 'string') {
      return firebaseTimestamp;
    }

    // Si es un objeto Timestamp de Firebase
    if (firebaseTimestamp && typeof firebaseTimestamp === 'object' && 
        '_seconds' in firebaseTimestamp && '_nanoseconds' in firebaseTimestamp) {
      // Convertir a milisegundos y luego a fecha
      const milliseconds = firebaseTimestamp._seconds * 1000 + firebaseTimestamp._nanoseconds / 1000000;
      return new Date(milliseconds).toISOString();
    }

    // Si el valor es undefined o null, devolver fecha actual
    if (firebaseTimestamp === undefined || firebaseTimestamp === null) {
      return new Date().toISOString();
    }

    // Para cualquier otro caso, intentar convertir a string
    return String(firebaseTimestamp);
  }
} 