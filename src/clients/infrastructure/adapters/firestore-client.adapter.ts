import { Client } from '../../domain/entities/client.entity';
import { Agent } from '../../domain/entities/agent.entity';
import { GasCylinder } from '../../domain/entities/gas-cylinder.entity';
import { ClientType } from '../../domain/enums/client-type.enum';
import { MembershipType } from '../../domain/enums/membership-type.enum';
import { FirebaseDateAdapter } from '../../../shared/infrastructure/adapters/firebase-date.adapter';

export class FirestoreClientAdapter {
  /**
   * Convierte datos de Firestore a una entidad Client
   */
  public static toClient(id: string, data: any): Client {
    // Convertir el agente
    const agent = new Agent(
      data.agent.name,
      data.agent.contactNumber
    );

    // Convertir los cilindros de gas
    const gasCylinders = data.gasCylinders.map(gc => 
      new GasCylinder(
        gc.id,
        gc.glMax,
        gc.glToLts
      )
    );

    // Usar el adaptador para convertir las fechas de Firebase a DateTimeString
    const createdAt = FirebaseDateAdapter.toDateTimeString(data.createdAt);
    const updatedAt = FirebaseDateAdapter.toDateTimeString(data.updatedAt);

    return new Client(
      id,
      data.name,
      agent,
      data.active,
      data.phone,
      data.type as ClientType,
      data.membership as MembershipType,
      gasCylinders,
      createdAt,
      updatedAt
    );
  }

  /**
   * Convierte una entidad Client a formato de datos para Firestore
   */
  public static toFirestoreData(client: Client): any {
    // Crear un objeto para el agente asegurándose que no tenga valores undefined
    const agentData = {
      name: client.agent.name || '',
    };
    
    // Solo añadir contactNumber si existe
    if (client.agent.contactNumber) {
      agentData['contactNumber'] = client.agent.contactNumber;
    }

    // Procesar cilindros de gas eliminando valores undefined
    const processedGasCylinders = client.gasCylinders.map(gc => {
      const cylinderData = {
        id: gc.id || '',
        glMax: gc.glMax || 0,
        glToLts: gc.glToLts || 0
      };
      return cylinderData;
    });

    return {
      name: client.name,
      agent: agentData,
      active: client.active,
      phone: client.phone,
      type: client.type,
      membership: client.membership,
      gasCylinders: processedGasCylinders,
      createdAt: client.createdAt,
      updatedAt: client.updatedAt
    };
  }
} 