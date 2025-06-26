import { SaveGasBillUseCase } from '../../../../src/gas-bill/application/use-cases/save-gas-bill.use-case';
import { GasBillRepository } from '../../../../src/gas-bill/application/ports/gas-bill.repository';
import { CreateGasBillDto } from '../../../../src/gas-bill/application/dtos/create-gas-bill.dto';
import { GasBill } from '../../../../src/gas-bill/domain/entities/gas-bill.entity';
import { InvalidGasBillDataException } from '../../../../src/gas-bill/domain/exceptions/invalid-gas-bill-data.exception';
import { mock, instance, when, verify, anything } from 'ts-mockito';

// Deshabilitar injection token requerimiento (direct injection no necessary)

describe('SaveGasBillUseCase', () => {
  let saveGasBillUseCase: SaveGasBillUseCase;
  let mockGasBillRepository: GasBillRepository;

  beforeEach(() => {
    mockGasBillRepository = mock<GasBillRepository>();
    saveGasBillUseCase = new SaveGasBillUseCase(
      instance(mockGasBillRepository)
    );
  });

  it('debería guardar una factura de gas correctamente', async () => {
    // Arrange
    const dto: CreateGasBillDto = {
      idMember: 'member-123',
      time: '2023-01-01T00:00:00.000Z',
      m3: 150,
      urlPhoto: 'https://example.com/photo.jpg'
    };

    // Mock para save: capturamos el GasBill y lo devolvemos
    when(mockGasBillRepository.save(anything())).thenCall((bill: GasBill) => bill);

    // Act
    const result = await saveGasBillUseCase.execute(dto);

    // Assert
    expect(result).toBeInstanceOf(GasBill);
    expect(result.idMember).toBe(dto.idMember);
    expect(result.time).toBe(dto.time);
    expect(result.m3).toBe(dto.m3);
    expect(result.urlPhoto).toBe(dto.urlPhoto);

    verify(mockGasBillRepository.save(anything())).once();
  });

  it('debería lanzar InvalidGasBillDataException cuando ocurre un error', async () => {
    // Arrange
    const dto: CreateGasBillDto = {
      idMember: 'member-123',
      time: '2023-01-01T00:00:00.000Z',
      m3: 150,
      urlPhoto: 'https://example.com/photo.jpg'
    };

    when(mockGasBillRepository.save(anything())).thenReject(new Error('DB error'));

    // Act & Assert
    await expect(saveGasBillUseCase.execute(dto)).rejects.toThrow(InvalidGasBillDataException);
    verify(mockGasBillRepository.save(anything())).once();
  });
}); 