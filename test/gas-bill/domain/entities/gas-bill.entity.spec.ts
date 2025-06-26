import { GasBill } from '../../../../src/gas-bill/domain/entities/gas-bill.entity';

// Utilidad para generar un GasBill de prueba
function createTestGasBill(): GasBill {
  return new GasBill(
    'gasbill-123',
    'member-456',
    '2023-01-01T00:00:00.000Z',
    123.45,
    'https://example.com/photo.jpg',
    '2023-01-01T00:00:00.000Z',
    '2023-01-01T00:00:00.000Z'
  );
}

describe('GasBill Entity', () => {
  it('debería exponer propiedades mediante getters', () => {
    // Arrange
    const gasBill = createTestGasBill();

    // Assert
    expect(gasBill.id).toBe('gasbill-123');
    expect(gasBill.idMember).toBe('member-456');
    expect(gasBill.time).toBe('2023-01-01T00:00:00.000Z');
    expect(gasBill.m3).toBe(123.45);
    expect(gasBill.urlPhoto).toBe('https://example.com/photo.jpg');
    expect(gasBill.createdAt).toBe('2023-01-01T00:00:00.000Z');
    expect(gasBill.updatedAt).toBe('2023-01-01T00:00:00.000Z');
  });

  it('debería actualizar m3 y updatedAt cuando se asigna un nuevo valor', () => {
    // Arrange
    const gasBill = createTestGasBill();
    const originalUpdatedAt = gasBill.updatedAt;

    // Act
    gasBill.m3 = 200;

    // Assert
    expect(gasBill.m3).toBe(200);
    expect(new Date(gasBill.updatedAt).getTime()).toBeGreaterThan(new Date(originalUpdatedAt).getTime());
  });

  it('debería actualizar urlPhoto y updatedAt cuando se asigna un nuevo valor', () => {
    // Arrange
    const gasBill = createTestGasBill();
    const originalUpdatedAt = gasBill.updatedAt;

    // Act
    gasBill.urlPhoto = 'https://example.com/new-photo.jpg';

    // Assert
    expect(gasBill.urlPhoto).toBe('https://example.com/new-photo.jpg');
    expect(new Date(gasBill.updatedAt).getTime()).toBeGreaterThan(new Date(originalUpdatedAt).getTime());
  });

  it('debería serializarse correctamente a JSON', () => {
    // Arrange
    const gasBill = createTestGasBill();

    // Act
    const json = gasBill.toJSON();

    // Assert
    expect(json).toEqual({
      id: 'gasbill-123',
      idMember: 'member-456',
      time: '2023-01-01T00:00:00.000Z',
      m3: 123.45,
      urlPhoto: 'https://example.com/photo.jpg',
      createdAt: '2023-01-01T00:00:00.000Z',
      updatedAt: '2023-01-01T00:00:00.000Z',
    });
  });
}); 