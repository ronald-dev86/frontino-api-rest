import { FindByTimeAndMemberUseCase } from '../../../../src/gas-bill/application/use-cases/find-by-time-and-member.use-case';
import { GasBillRepository } from '../../../../src/gas-bill/application/ports/gas-bill.repository';
import { GasBill } from '../../../../src/gas-bill/domain/entities/gas-bill.entity';
import { mock, instance, when, verify } from 'ts-mockito';


describe('FindByTimeAndMemberUseCase', () => {
  let useCase: FindByTimeAndMemberUseCase;
  let repoMock: GasBillRepository;

  beforeEach(() => {
    repoMock = mock<GasBillRepository>();
    useCase = new FindByTimeAndMemberUseCase(instance(repoMock));
  });

  const time = '2023-01-01T00:00:00.000Z';
  const idMember = 'member-123';

  it('debería devolver la factura cuando existe', async () => {
    const gasBill = new GasBill('bill-1', idMember, time, 100, '', time, time);
    when(repoMock.findByTimeAndMember(time, idMember)).thenResolve(gasBill);

    const result = await useCase.execute(time, idMember);

    expect(result).toEqual(gasBill);
    verify(repoMock.findByTimeAndMember(time, idMember)).once();
  });

  it('debería devolver null cuando no existe factura', async () => {
    when(repoMock.findByTimeAndMember(time, idMember)).thenResolve(null);

    const result = await useCase.execute(time, idMember);

    expect(result).toBeNull();
    verify(repoMock.findByTimeAndMember(time, idMember)).once();
  });
}); 