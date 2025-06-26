import { UpdateGasBillUseCase } from '../../../../src/gas-bill/application/use-cases/update-gas-bill.use-case';
import { GasBillRepository } from '../../../../src/gas-bill/application/ports/gas-bill.repository';
import { GasBill } from '../../../../src/gas-bill/domain/entities/gas-bill.entity';
import { UpdateGasBillDto } from '../../../../src/gas-bill/application/dtos/update-gas-bill.dto';
import { GasBillNotFoundException } from '../../../../src/gas-bill/domain/exceptions/gas-bill-not-found.exception';
import { InvalidGasBillDataException } from '../../../../src/gas-bill/domain/exceptions/invalid-gas-bill-data.exception';
import { mock, instance, when, verify, anything } from 'ts-mockito';


describe('UpdateGasBillUseCase', () => {
  let updateGasBillUseCase: UpdateGasBillUseCase;
  let mockGasBillRepository: GasBillRepository;
  let existingGasBill: GasBill;

  beforeEach(() => {
    mockGasBillRepository = mock<GasBillRepository>();
    updateGasBillUseCase = new UpdateGasBillUseCase(instance(mockGasBillRepository));

    existingGasBill = new GasBill(
      'bill-123',
      'member-123',
      '2023-01-01T00:00:00.000Z',
      100,
      '',
      '2023-01-01T00:00:00.000Z',
      '2023-01-01T00:00:00.000Z'
    );
  });

  it('debería actualizar una factura de gas correctamente', async () => {
    // Arrange
    const dto: UpdateGasBillDto = {
      m3: 150,
      urlPhoto: 'https://example.com/new.jpg'
    };

    when(mockGasBillRepository.findById('bill-123')).thenResolve(existingGasBill);
    when(mockGasBillRepository.update('bill-123', dto)).thenResolve({ ...existingGasBill, m3: 150, urlPhoto: 'https://example.com/new.jpg' } as GasBill);

    // Act
    const result = await updateGasBillUseCase.execute('bill-123', dto);

    // Assert
    expect(result.m3).toBe(150);
    expect(result.urlPhoto).toBe('https://example.com/new.jpg');

    verify(mockGasBillRepository.findById('bill-123')).once();
    verify(mockGasBillRepository.update('bill-123', dto)).once();
  });

  it('debería lanzar GasBillNotFoundException cuando la factura no existe', async () => {
    // Arrange
    const dto: UpdateGasBillDto = { m3: 150 };
    when(mockGasBillRepository.findById('non-existing')).thenResolve(null);

    // Act & Assert
    await expect(updateGasBillUseCase.execute('non-existing', dto)).rejects.toThrow(GasBillNotFoundException);
    verify(mockGasBillRepository.findById('non-existing')).once();
    verify(mockGasBillRepository.update(anything(), anything())).never();
  });

  it('debería lanzar InvalidGasBillDataException cuando ocurre un error al actualizar', async () => {
    // Arrange
    const dto: UpdateGasBillDto = { m3: 200 };
    when(mockGasBillRepository.findById('bill-123')).thenResolve(existingGasBill);
    when(mockGasBillRepository.update('bill-123', dto)).thenReject(new Error('DB error'));

    // Act & Assert
    await expect(updateGasBillUseCase.execute('bill-123', dto)).rejects.toThrow(InvalidGasBillDataException);
    verify(mockGasBillRepository.findById('bill-123')).once();
    verify(mockGasBillRepository.update('bill-123', dto)).once();
  });
}); 