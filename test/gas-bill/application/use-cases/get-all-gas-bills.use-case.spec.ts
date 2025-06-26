import { GetAllGasBillsUseCase } from '../../../../src/gas-bill/application/use-cases/get-all-gas-bills.use-case';
import { GasBillRepository } from '../../../../src/gas-bill/application/ports/gas-bill.repository';
import { GasBill } from '../../../../src/gas-bill/domain/entities/gas-bill.entity';
import { mock, instance, when, verify } from 'ts-mockito';


describe('GetAllGasBillsUseCase', () => {
  let getAllGasBillsUseCase: GetAllGasBillsUseCase;
  let mockGasBillRepository: GasBillRepository;

  beforeEach(() => {
    mockGasBillRepository = mock<GasBillRepository>();
    getAllGasBillsUseCase = new GetAllGasBillsUseCase(
      instance(mockGasBillRepository)
    );
  });

  it('debería devolver todas las facturas de gas', async () => {
    // Arrange
    const gasBills: GasBill[] = [
      new GasBill('id1', 'member1', '2023-01-01T00:00:00.000Z', 100, '', '2023-01-01T00:00:00.000Z', '2023-01-01T00:00:00.000Z'),
      new GasBill('id2', 'member2', '2023-02-01T00:00:00.000Z', 200, '', '2023-02-01T00:00:00.000Z', '2023-02-01T00:00:00.000Z')
    ];

    when(mockGasBillRepository.findAll()).thenResolve(gasBills);

    // Act
    const result = await getAllGasBillsUseCase.execute();

    // Assert
    expect(result).toEqual(gasBills);
    verify(mockGasBillRepository.findAll()).once();
  });
}); 