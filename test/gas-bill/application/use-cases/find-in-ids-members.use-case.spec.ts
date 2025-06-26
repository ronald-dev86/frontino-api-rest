import { FindInIdsMembersUseCase } from '../../../../src/gas-bill/application/use-cases/find-in-ids-members.use-case';
import { GasBillRepository } from '../../../../src/gas-bill/application/ports/gas-bill.repository';
import { GasBill } from '../../../../src/gas-bill/domain/entities/gas-bill.entity';
import { mock, instance, when, verify } from 'ts-mockito';


describe('FindInIdsMembersUseCase', () => {
  let useCase: FindInIdsMembersUseCase;
  let repoMock: GasBillRepository;

  beforeEach(() => {
    repoMock = mock<GasBillRepository>();
    useCase = new FindInIdsMembersUseCase(instance(repoMock));
  });

  it('debería devolver facturas para los miembros especificados', async () => {
    const ids = ['member-1', 'member-2'];
    const gasBills: GasBill[] = [
      new GasBill('bill-1', 'member-1', '2023-01-01T00:00:00.000Z', 100, '', '2023-01-01T00:00:00.000Z', '2023-01-01T00:00:00.000Z'),
      new GasBill('bill-2', 'member-2', '2023-02-01T00:00:00.000Z', 200, '', '2023-02-01T00:00:00.000Z', '2023-02-01T00:00:00.000Z')
    ];

    when(repoMock.findInIdsMembers(ids)).thenResolve(gasBills);

    const result = await useCase.execute(ids);

    expect(result).toEqual(gasBills);
    verify(repoMock.findInIdsMembers(ids)).once();
  });

  it('debería devolver array vacío si no se encuentran facturas', async () => {
    const ids = ['member-3'];
    when(repoMock.findInIdsMembers(ids)).thenResolve([]);

    const result = await useCase.execute(ids);

    expect(result).toEqual([]);
    verify(repoMock.findInIdsMembers(ids)).once();
  });
}); 