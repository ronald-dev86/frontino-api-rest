import * as admin from 'firebase-admin';
import { ServiceAccount } from 'firebase-admin';

/**
 * Inicializa la aplicación Firebase.
 * El archivo de credenciales debe estar en /path/to/credentials.json
 * Reemplaza esto con la ubicación real de tu archivo de credenciales.
 */
export function initializeFirebase() {
  // Si ya está inicializado, retornar la instancia existente
  if (admin.apps.length) {
    return admin.app();
  }

  try {
    // Intenta cargar el archivo de credenciales
    // IMPORTANTE: Reemplaza 'credentials.json' con la ruta a tu archivo de credenciales
    const serviceAccount = require('../../firebase-credentials.json');

    // Inicializa Firebase con las credenciales
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount as ServiceAccount),
      // Opcional: Puedes agregar otras configuraciones como la URL de tu base de datos
      // databaseURL: 'https://tu-proyecto.firebaseio.com'
    });

    console.log('Firebase inicializado correctamente');
    return admin.app();
  } catch (error) {
    console.error('Error al inicializar Firebase:', error);
    throw error;
  }
}

// Obtener la instancia de Firestore
export function getFirestore() {
  return admin.firestore();
} 