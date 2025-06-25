import { Controller, Get, Post, Put, Delete, Body, Param, Query, HttpStatus, HttpException } from '@nestjs/common';
import { CreateGasCylinderRefillUseCase } from '../../application/use-cases/create-gas-cylinder-refill.use-case';
import { GetAllGasCylinderRefillsUseCase } from '../../application/use-cases/get-all-gas-cylinder-refills.use-case';
import { GetGasCylinderRefillByIdUseCase } from '../../application/use-cases/get-gas-cylinder-refill-by-id.use-case';
import { GetGasCylinderRefillsByCylinderIdUseCase } from '../../application/use-cases/get-gas-cylinder-refills-by-cylinder-id.use-case';
import { UpdateGasCylinderRefillUseCase } from '../../application/use-cases/update-gas-cylinder-refill.use-case';
import { DeleteGasCylinderRefillUseCase } from '../../application/use-cases/delete-gas-cylinder-refill.use-case';
import { CreateGasCylinderRefillDto } from '../../application/dtos/create-gas-cylinder-refill.dto';
import { UpdateGasCylinderRefillDto } from '../../application/dtos/update-gas-cylinder-refill.dto';
import { BaseController } from '../../../shared/infrastructure/controllers/base.controller';
import { GasCylinderRefillNotFoundException } from '../../domain/exceptions/gas-cylinder-refill-not-found.exception';
import { InvalidGasCylinderRefillDataException } from '../../domain/exceptions/invalid-gas-cylinder-refill-data.exception';

@Controller('gas-cylinder-refills')
export class GasCylinderRefillController extends BaseController {
  constructor(
    private readonly createGasCylinderRefillUseCase: CreateGasCylinderRefillUseCase,
    private readonly getAllGasCylinderRefillsUseCase: GetAllGasCylinderRefillsUseCase,
    private readonly getGasCylinderRefillByIdUseCase: GetGasCylinderRefillByIdUseCase,
    private readonly getGasCylinderRefillsByCylinderIdUseCase: GetGasCylinderRefillsByCylinderIdUseCase,
    private readonly updateGasCylinderRefillUseCase: UpdateGasCylinderRefillUseCase,
    private readonly deleteGasCylinderRefillUseCase: DeleteGasCylinderRefillUseCase,
  ) {
    super();
  }

  @Post()
  async create(@Body() createGasCylinderRefillDto: CreateGasCylinderRefillDto) {
    try {
      const gasCylinderRefill = await this.createGasCylinderRefillUseCase.execute(createGasCylinderRefillDto);
      return this.responseCreated(gasCylinderRefill, 'Recarga de cilindro creada correctamente');
    } catch (error) {
      if (error instanceof InvalidGasCylinderRefillDataException) {
        throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
      }
      throw new HttpException('Error al crear recarga de cilindro', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get()
  async findAll(@Query('cylinderId') cylinderId?: string) {
    try {
      if (cylinderId) {
        const refills = await this.getGasCylinderRefillsByCylinderIdUseCase.execute(cylinderId);
        return this.responseSuccess(refills, 'Recargas de cilindro recuperadas correctamente por ID de cilindro');
      } else {
        const refills = await this.getAllGasCylinderRefillsUseCase.execute();
        return this.responseSuccess(refills, 'Recargas de cilindro recuperadas correctamente');
      }
    } catch (error) {
      throw new HttpException('Error al obtener recargas de cilindro', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    try {
      const gasCylinderRefill = await this.getGasCylinderRefillByIdUseCase.execute(id);
      return this.responseSuccess(gasCylinderRefill, 'Recarga de cilindro recuperada correctamente');
    } catch (error) {
      if (error instanceof GasCylinderRefillNotFoundException) {
        throw new HttpException(error.message, HttpStatus.NOT_FOUND);
      }
      throw new HttpException('Error al obtener recarga de cilindro', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updateGasCylinderRefillDto: UpdateGasCylinderRefillDto) {
    try {
      const gasCylinderRefill = await this.updateGasCylinderRefillUseCase.execute(id, updateGasCylinderRefillDto);
      return this.responseSuccess(gasCylinderRefill, 'Recarga de cilindro actualizada correctamente');
    } catch (error) {
      if (error instanceof GasCylinderRefillNotFoundException) {
        throw new HttpException(error.message, HttpStatus.NOT_FOUND);
      }
      if (error instanceof InvalidGasCylinderRefillDataException) {
        throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
      }
      throw new HttpException('Error al actualizar recarga de cilindro', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    try {
      await this.deleteGasCylinderRefillUseCase.execute(id);
      return this.responseSuccess(null, 'Recarga de cilindro eliminada correctamente');
    } catch (error) {
      if (error instanceof GasCylinderRefillNotFoundException) {
        throw new HttpException(error.message, HttpStatus.NOT_FOUND);
      }
      throw new HttpException('Error al eliminar recarga de cilindro', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
} 