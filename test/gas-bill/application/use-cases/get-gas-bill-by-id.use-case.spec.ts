import { GetGasBillByIdUseCase } from '../../../../src/gas-bill/application/use-cases/get-gas-bill-by-id.use-case';
import { GasBillRepository } from '../../../../src/gas-bill/application/ports/gas-bill.repository';
import { GasBill } from '../../../../src/gas-bill/domain/entities/gas-bill.entity';
import { GasBillNotFoundException } from '../../../../src/gas-bill/domain/exceptions/gas-bill-not-found.exception';
import { mock, instance, when, verify } from 'ts-mockito';


describe('GetGasBillByIdUseCase', () => {
  let getGasBillByIdUseCase: GetGasBillByIdUseCase;
  let mockGasBillRepository: GasBillRepository;

  beforeEach(() => {
    mockGasBillRepository = mock<GasBillRepository>();
    getGasBillByIdUseCase = new GetGasBillByIdUseCase(instance(mockGasBillRepository));
  });

  it('debería devolver la factura de gas cuando existe', async () => {
    const id = 'bill-123';
    const gasBill = new GasBill(id, 'member1', '2023-01-01T00:00:00.000Z', 123, '', '2023-01-01T00:00:00.000Z', '2023-01-01T00:00:00.000Z');
    when(mockGasBillRepository.findById(id)).thenResolve(gasBill);

    const result = await getGasBillByIdUseCase.execute(id);

    expect(result).toEqual(gasBill);
    verify(mockGasBillRepository.findById(id)).once();
  });

  it('debería lanzar GasBillNotFoundException cuando no existe', async () => {
    const id = 'non-existing';
    when(mockGasBillRepository.findById(id)).thenResolve(null);

    await expect(getGasBillByIdUseCase.execute(id)).rejects.toThrow(GasBillNotFoundException);
    verify(mockGasBillRepository.findById(id)).once();
  });
}); 