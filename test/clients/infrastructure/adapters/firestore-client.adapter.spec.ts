import { FirestoreClientAdapter } from '../../../../src/clients/infrastructure/adapters/firestore-client.adapter';
import { Client } from '../../../../src/clients/domain/entities/client.entity';
import { ClientType } from '../../../../src/clients/domain/enums/client-type.enum';
import { MembershipType } from '../../../../src/clients/domain/enums/membership-type.enum';
import { Agent } from '../../../../src/clients/domain/entities/agent.entity';
import { GasCylinder } from '../../../../src/clients/domain/entities/gas-cylinder.entity';

describe('FirestoreClientAdapter', () => {
  const clientId = 'test-id';
  const agent = new Agent('Agent Name', '123456789');
  const gasCylinder = new GasCylinder('cylinder-1', 45, 0.454);

  // Cliente de prueba
  let testClient: Client;
  
  // Datos de Firestore simulados
  let firestoreData: any;

  beforeEach(() => {
    // Crear cliente de prueba con todos los datos necesarios
    testClient = new Client(
      clientId,
      'Test Client',
      agent,
      true,
      '987654321',
      ClientType.RESIDENTIAL,
      MembershipType.BASIC,
      [gasCylinder],
      '2023-01-01T00:00:00.000Z',
      '2023-01-01T00:00:00.000Z'
    );

    // Datos de Firestore simulados
    firestoreData = {
      name: 'Test Client',
      agent: {
        name: 'Agent Name',
        contactNumber: '123456789'
      },
      active: true,
      phone: '987654321',
      type: ClientType.RESIDENTIAL,
      membership: MembershipType.BASIC,
      gasCylinders: [
        {
          id: 'cylinder-1',
          glMax: 45,
          glToLts: 0.454
        }
      ],
      createdAt: {
        _seconds: 1672531200,
        _nanoseconds: 0
      },
      updatedAt: {
        _seconds: 1672531200,
        _nanoseconds: 0
      }
    };
  });

  describe('toClient', () => {
    it('debería convertir datos de Firestore a una entidad Cliente', () => {
      // Act
      const result = FirestoreClientAdapter.toClient(clientId, firestoreData);

      // Assert
      expect(result).toBeInstanceOf(Client);
      expect(result.id).toEqual(clientId);
      expect(result.name).toEqual(firestoreData.name);
      expect(result.active).toEqual(firestoreData.active);
      expect(result.phone).toEqual(firestoreData.phone);
      expect(result.type).toEqual(firestoreData.type);
      expect(result.membership).toEqual(firestoreData.membership);
      
      // Verificar el agente
      expect(result.agent).toBeInstanceOf(Agent);
      expect(result.agent.name).toEqual(firestoreData.agent.name);
      expect(result.agent.contactNumber).toEqual(firestoreData.agent.contactNumber);
      
      // Verificar los cilindros de gas
      expect(result.gasCylinders).toHaveLength(1);
      expect(result.gasCylinders[0]).toBeInstanceOf(GasCylinder);
      expect(result.gasCylinders[0].id).toEqual(firestoreData.gasCylinders[0].id);
      expect(result.gasCylinders[0].glMax).toEqual(firestoreData.gasCylinders[0].glMax);
      expect(result.gasCylinders[0].glToLts).toEqual(firestoreData.gasCylinders[0].glToLts);
    });

    it('debería manejar fechas en diferentes formatos', () => {
      // Arrange
      const firestoreDataWithStringDate = {
        ...firestoreData,
        createdAt: '2023-01-01T00:00:00.000Z',
        updatedAt: '2023-01-01T00:00:00.000Z'
      };

      // Act
      const result = FirestoreClientAdapter.toClient(clientId, firestoreDataWithStringDate);

      // Assert
      expect(result.createdAt).toBe('2023-01-01T00:00:00.000Z');
      expect(result.updatedAt).toBe('2023-01-01T00:00:00.000Z');
    });
  });

  describe('toFirestoreData', () => {
    it('debería convertir una entidad Cliente a formato Firestore', () => {
      // Act
      const result = FirestoreClientAdapter.toFirestoreData(testClient);

      // Assert
      expect(result).toEqual({
        name: testClient.name,
        agent: {
          name: testClient.agent.name,
          contactNumber: testClient.agent.contactNumber
        },
        active: testClient.active,
        phone: testClient.phone,
        type: testClient.type,
        membership: testClient.membership,
        gasCylinders: [{
          id: testClient.gasCylinders[0].id,
          glMax: testClient.gasCylinders[0].glMax,
          glToLts: testClient.gasCylinders[0].glToLts
        }],
        createdAt: testClient.createdAt,
        updatedAt: testClient.updatedAt
      });
    });

    it('debería manejar valores nulos o undefined en datos opcionales', () => {
      // Arrange
      const agentWithoutContact = new Agent('Agent Name', '');
      const clientWithoutOptionalData = new Client(
        clientId,
        'Test Client',
        agentWithoutContact,
        true,
        '987654321',
        ClientType.RESIDENTIAL,
        MembershipType.BASIC,
        [],
        '2023-01-01T00:00:00.000Z',
        '2023-01-01T00:00:00.000Z'
      );

      // Act
      const result = FirestoreClientAdapter.toFirestoreData(clientWithoutOptionalData);

      // Assert
      expect(result.agent).toEqual({ name: 'Agent Name' });
      expect(result.agent.contactNumber).toBeUndefined();
      expect(result.gasCylinders).toEqual([]);
    });
  });
}); 