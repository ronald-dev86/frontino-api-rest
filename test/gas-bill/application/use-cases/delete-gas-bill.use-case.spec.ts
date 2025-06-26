import { DeleteGasBillUseCase } from '../../../../src/gas-bill/application/use-cases/delete-gas-bill.use-case';
import { GasBillRepository } from '../../../../src/gas-bill/application/ports/gas-bill.repository';
import { GasBill } from '../../../../src/gas-bill/domain/entities/gas-bill.entity';
import { GasBillNotFoundException } from '../../../../src/gas-bill/domain/exceptions/gas-bill-not-found.exception';
import { mock, instance, when, verify } from 'ts-mockito';


describe('DeleteGasBillUseCase', () => {
  let deleteGasBillUseCase: DeleteGasBillUseCase;
  let mockGasBillRepository: GasBillRepository;

  beforeEach(() => {
    mockGasBillRepository = mock<GasBillRepository>();
    deleteGasBillUseCase = new DeleteGasBillUseCase(instance(mockGasBillRepository));
  });

  it('debería eliminar una factura de gas existente', async () => {
    const gasBill = new GasBill('bill-123', 'member-1', '2023-01-01T00:00:00.000Z', 100, '', '2023-01-01T00:00:00.000Z', '2023-01-01T00:00:00.000Z');
    when(mockGasBillRepository.findById('bill-123')).thenResolve(gasBill);
    when(mockGasBillRepository.delete('bill-123')).thenResolve();

    await deleteGasBillUseCase.execute('bill-123');

    verify(mockGasBillRepository.findById('bill-123')).once();
    verify(mockGasBillRepository.delete('bill-123')).once();
  });

  it('debería lanzar GasBillNotFoundException cuando la factura no existe', async () => {
    when(mockGasBillRepository.findById('non-existing')).thenResolve(null);

    await expect(deleteGasBillUseCase.execute('non-existing')).rejects.toThrow(GasBillNotFoundException);
    verify(mockGasBillRepository.findById('non-existing')).once();
    verify(mockGasBillRepository.delete('non-existing')).never();
  });
}); 