import { Controller, Get, Post, Put, Delete, Body, Param, Query } from '@nestjs/common';
import { CreateGasCylinderRefillUseCase } from '../../application/use-cases/create-gas-cylinder-refill.use-case';
import { GetAllGasCylinderRefillsUseCase } from '../../application/use-cases/get-all-gas-cylinder-refills.use-case';
import { GetGasCylinderRefillByIdUseCase } from '../../application/use-cases/get-gas-cylinder-refill-by-id.use-case';
import { GetGasCylinderRefillsByCylinderIdUseCase } from '../../application/use-cases/get-gas-cylinder-refills-by-cylinder-id.use-case';
import { UpdateGasCylinderRefillUseCase } from '../../application/use-cases/update-gas-cylinder-refill.use-case';
import { DeleteGasCylinderRefillUseCase } from '../../application/use-cases/delete-gas-cylinder-refill.use-case';
import { CreateGasCylinderRefillDto } from '../../application/dtos/create-gas-cylinder-refill.dto';
import { UpdateGasCylinderRefillDto } from '../../application/dtos/update-gas-cylinder-refill.dto';

@Controller('gas-cylinder-refills')
export class GasCylinderRefillController {
  constructor(
    private readonly createGasCylinderRefillUseCase: CreateGasCylinderRefillUseCase,
    private readonly getAllGasCylinderRefillsUseCase: GetAllGasCylinderRefillsUseCase,
    private readonly getGasCylinderRefillByIdUseCase: GetGasCylinderRefillByIdUseCase,
    private readonly getGasCylinderRefillsByCylinderIdUseCase: GetGasCylinderRefillsByCylinderIdUseCase,
    private readonly updateGasCylinderRefillUseCase: UpdateGasCylinderRefillUseCase,
    private readonly deleteGasCylinderRefillUseCase: DeleteGasCylinderRefillUseCase,
  ) {}

  @Post()
  async create(@Body() createGasCylinderRefillDto: CreateGasCylinderRefillDto) {
    const gasCylinderRefill = await this.createGasCylinderRefillUseCase.execute(createGasCylinderRefillDto);
    return gasCylinderRefill.toJSON();
  }

  @Get()
  async findAll(@Query('cylinderId') cylinderId?: string) {
    if (cylinderId) {
      const refills = await this.getGasCylinderRefillsByCylinderIdUseCase.execute(cylinderId);
      return refills.map(refill => refill.toJSON());
    } else {
      const refills = await this.getAllGasCylinderRefillsUseCase.execute();
      return refills.map(refill => refill.toJSON());
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const gasCylinderRefill = await this.getGasCylinderRefillByIdUseCase.execute(id);
    return gasCylinderRefill.toJSON();
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updateGasCylinderRefillDto: UpdateGasCylinderRefillDto) {
    const gasCylinderRefill = await this.updateGasCylinderRefillUseCase.execute(id, updateGasCylinderRefillDto);
    return gasCylinderRefill.toJSON();
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    await this.deleteGasCylinderRefillUseCase.execute(id);
    return { message: 'Recarga eliminada exitosamente' };
  }
} 