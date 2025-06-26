import { InMemoryGasBillRepository } from '../../../../src/gas-bill/infrastructure/repositories/in-memory-gas-bill.repository';
import { GasBill } from '../../../../src/gas-bill/domain/entities/gas-bill.entity';

describe('InMemoryGasBillRepository', () => {
  let repository: InMemoryGasBillRepository;
  let gasBill1: GasBill;
  let gasBill2: GasBill;

  beforeEach(() => {
    repository = new InMemoryGasBillRepository();
    gasBill1 = new GasBill('bill-1', 'member-1', '2023-01-01T00:00:00.000Z', 100, 'url1', '2023-01-01T00:00:00.000Z', '2023-01-01T00:00:00.000Z');
    gasBill2 = new GasBill('bill-2', 'member-2', '2023-02-01T00:00:00.000Z', 200, 'url2', '2023-02-01T00:00:00.000Z', '2023-02-01T00:00:00.000Z');
  });

  it('save debería almacenar la factura', async () => {
    await repository.save(gasBill1);
    const stored = await repository.findById('bill-1');
    expect(stored).toEqual(gasBill1);
  });

  it('findAll debería devolver todas las facturas', async () => {
    await repository.save(gasBill1);
    await repository.save(gasBill2);

    const result = await repository.findAll();
    expect(result).toEqual([gasBill1, gasBill2]);
  });

  it('findByTimeAndMember debería devolver la factura correcta', async () => {
    await repository.save(gasBill1);
    const result = await repository.findByTimeAndMember('2023-01-01T00:00:00.000Z', 'member-1');
    expect(result).toEqual(gasBill1);
  });

  it('findInIdsMembers debería filtrar por miembros', async () => {
    await repository.save(gasBill1);
    await repository.save(gasBill2);

    const result = await repository.findInIdsMembers(['member-2']);
    expect(result).toEqual([gasBill2]);
  });

  it('update debería modificar la factura', async () => {
    await repository.save(gasBill1);
    const updated = await repository.update('bill-1', { m3: 150 });
    expect(updated.m3).toBe(150);
    const fetched = await repository.findById('bill-1');
    expect(fetched?.m3).toBe(150);
  });

  it('update debería lanzar error si la factura no existe', async () => {
    await expect(repository.update('non-existing', { m3: 100 })).rejects.toThrow(/no encontrado/);
  });

  it('delete debería eliminar la factura', async () => {
    await repository.save(gasBill1);
    await repository.delete('bill-1');
    const result = await repository.findById('bill-1');
    expect(result).toBeNull();
  });

  it('delete debería lanzar error si la factura no existe', async () => {
    await expect(repository.delete('non-existing')).rejects.toThrow(/no encontrado/);
  });
}); 