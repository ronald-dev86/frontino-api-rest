import { Client } from '../../../../src/clients/domain/entities/client.entity';
import { ClientType } from '../../../../src/clients/domain/enums/client-type.enum';
import { MembershipType } from '../../../../src/clients/domain/enums/membership-type.enum';
import { InvalidClientDataException } from '../../../../src/clients/domain/exceptions/invalid-client-data.exception';
import { Agent } from '../../../../src/clients/domain/entities/agent.entity';

describe('Client Entity', () => {
  it('debería crear un cliente válido', () => {
    // Arrange & Act
    const agent = new Agent('Agent Name', '987654321');
    
    const client = new Client(
      'client-123',
      'Test Client',
      agent,
      true,
      '123456789',
      ClientType.RESIDENTIAL,
      MembershipType.BASIC,
      [],
      new Date().toISOString(),
      new Date().toISOString()
    );

    // Assert
    expect(client).toBeDefined();
    expect(client.id).toBe('client-123');
    expect(client.name).toBe('Test Client');
    expect(client.type).toBe(ClientType.RESIDENTIAL);
    expect(client.phone).toBe('123456789');
    expect(client.active).toBe(true);
    expect(client.membership).toBe(MembershipType.BASIC);
    expect(client.agent).toBeDefined();
    expect(client.agent.name).toBe('Agent Name');
    expect(client.gasCylinders).toEqual([]);
  });

  it('debería permitir modificar los datos del cliente a través de setters', () => {
    // Arrange
    const agent = new Agent('Agent Name', '987654321');
    
    const client = new Client(
      'client-123',
      'Test Client',
      agent,
      true,
      '123456789',
      ClientType.RESIDENTIAL,
      MembershipType.BASIC,
      [],
      new Date().toISOString(),
      new Date().toISOString()
    );

    const newAgent = new Agent('New Agent', '555123456');

    // Act
    client.name = 'Updated Client Name';
    client.phone = '987654321';
    client.type = ClientType.COMMERCIAL;
    client.active = false;
    client.membership = MembershipType.PREMIUM;
    client.agent = newAgent;

    // Assert
    expect(client.name).toBe('Updated Client Name');
    expect(client.phone).toBe('987654321');
    expect(client.type).toBe(ClientType.COMMERCIAL);
    expect(client.active).toBe(false);
    expect(client.membership).toBe(MembershipType.PREMIUM);
    expect(client.agent.name).toBe('New Agent');
    expect(client.agent.contactNumber).toBe('555123456');
  });

  it('debería permitir agregar y eliminar cilindros de gas', () => {
    // Arrange
    const agent = new Agent('Agent Name', '987654321');
    
    const client = new Client(
      'client-123',
      'Test Client',
      agent,
      true,
      '123456789',
      ClientType.RESIDENTIAL,
      MembershipType.BASIC,
      [],
      new Date().toISOString(),
      new Date().toISOString()
    );

    // Mock para GasCylinder
    const gasCylinder = {
      id: 'cylinder-1',
      toJSON: () => ({
        id: 'cylinder-1'
      })
    };

    // Act
    client.addGasCylinder(gasCylinder as any);
    
    // Assert
    expect(client.gasCylinders.length).toBe(1);
    expect(client.gasCylinders[0].id).toBe('cylinder-1');
    
    // Act - eliminar cilindro
    client.removeGasCylinder('cylinder-1');
    
    // Assert
    expect(client.gasCylinders.length).toBe(0);
  });
  
  it('debería serializar correctamente a JSON', () => {
    // Arrange
    const agent = new Agent('Agent Name', '987654321');
    const now = new Date().toISOString();
    
    const client = new Client(
      'client-123',
      'Test Client',
      agent,
      true,
      '123456789',
      ClientType.RESIDENTIAL,
      MembershipType.BASIC,
      [],
      now,
      now
    );

    // Act
    const json = client.toJSON();

    // Assert
    expect(json).toEqual({
      id: 'client-123',
      name: 'Test Client',
      agent: {
        name: 'Agent Name',
        contactNumber: '987654321'
      },
      active: true,
      phone: '123456789',
      type: ClientType.RESIDENTIAL,
      membership: MembershipType.BASIC,
      gasCylinders: [],
      createdAt: now,
      updatedAt: now
    });
  });
}); 