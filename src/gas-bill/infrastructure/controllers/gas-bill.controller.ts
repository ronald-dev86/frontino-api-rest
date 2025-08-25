import { Controller, Get, Post, Put, Delete, Body, Param, HttpStatus, HttpException, Query } from '@nestjs/common';
import { SaveGasBillUseCase } from '../../application/use-cases/save-gas-bill.use-case';
import { GetGasBillByIdUseCase } from '../../application/use-cases/get-gas-bill-by-id.use-case';
import { GetAllGasBillsUseCase } from '../../application/use-cases/get-all-gas-bills.use-case';
import { UpdateGasBillUseCase } from '../../application/use-cases/update-gas-bill.use-case';
import { DeleteGasBillUseCase } from '../../application/use-cases/delete-gas-bill.use-case';
import { FindByTimeAndMemberUseCase } from '../../application/use-cases/find-by-time-and-member.use-case';
import { FindInIdsMembersUseCase } from '../../application/use-cases/find-in-ids-members.use-case';
import { GroupGasBillsByTimeUseCase } from '../../application/use-cases/group-gas-bills-by-time.use-case';
import { GroupedGasBillsDto } from '../../application/dtos/grouped-gas-bills.dto';
import { CreateGasBillDto } from '../../application/dtos/create-gas-bill.dto';
import { UpdateGasBillDto } from '../../application/dtos/update-gas-bill.dto';
import { GasBillNotFoundException } from '../../domain/exceptions/gas-bill-not-found.exception';
import { InvalidGasBillDataException } from '../../domain/exceptions/invalid-gas-bill-data.exception';
import { BaseController } from '../../../shared/infrastructure/controllers/base.controller';

@Controller('gas-bills')
export class GasBillController extends BaseController {
  constructor(
    private readonly saveGasBillUseCase: SaveGasBillUseCase,
    private readonly getGasBillByIdUseCase: GetGasBillByIdUseCase,
    private readonly getAllGasBillsUseCase: GetAllGasBillsUseCase,
    private readonly updateGasBillUseCase: UpdateGasBillUseCase,
    private readonly deleteGasBillUseCase: DeleteGasBillUseCase,
    private readonly findByTimeAndMemberUseCase: FindByTimeAndMemberUseCase,
    private readonly findInIdsMembersUseCase: FindInIdsMembersUseCase,
    private readonly groupGasBillsByTimeUseCase: GroupGasBillsByTimeUseCase,
  ) {
    super();
  }

  @Post()
  async create(@Body() createGasBillDto: CreateGasBillDto) {
    try {
      const gasBill = await this.saveGasBillUseCase.execute(createGasBillDto);
      return this.responseCreated(gasBill, 'Factura de gas creada correctamente');
    } catch (error) {
      if (error instanceof InvalidGasBillDataException) {
        throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
      }
      throw new HttpException('Error al crear factura de gas', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get()
  async findAll() {
    try {
      const gasBills = await this.getAllGasBillsUseCase.execute();
      return this.responseSuccess(gasBills, 'Facturas de gas recuperadas correctamente');
    } catch (error) {
      throw new HttpException('Error al obtener facturas de gas', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get(':id')
  async findById(@Param('id') id: string) {
    try {
      const gasBill = await this.getGasBillByIdUseCase.execute(id);
      return this.responseSuccess(gasBill, 'Factura de gas recuperada correctamente');
    } catch (error) {
      if (error instanceof GasBillNotFoundException) {
        throw new HttpException(error.message, HttpStatus.NOT_FOUND);
      }
      throw new HttpException('Error al obtener factura de gas', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get('member/:memberId/time/:time')
  async findByTimeAndMember(@Param('memberId') memberId: string, @Param('time') time: string) {
    try {
      const gasBill = await this.findByTimeAndMemberUseCase.execute(time, memberId);
      if (!gasBill) {
        throw new GasBillNotFoundException('con el tiempo y miembro especificados');
      }
      return this.responseSuccess(gasBill, 'Factura de gas recuperada correctamente');
    } catch (error) {
      if (error instanceof GasBillNotFoundException) {
        throw new HttpException(error.message, HttpStatus.NOT_FOUND);
      }
      throw new HttpException('Error al obtener factura de gas por tiempo y miembro', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Post('members-ids')
  async findInIdsMembers(@Body() body: { idMembers: string[] }) {
    try {
      const gasBills = await this.findInIdsMembersUseCase.execute(body.idMembers);
      return this.responseSuccess(gasBills, 'Facturas de gas recuperadas correctamente por IDs de miembros');
    } catch (error) {
      throw new HttpException('Error al obtener facturas de gas por IDs de miembros', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get(':id/grouped-by-time')
  async getGroupedByTime(@Param('id') id: string) {
    try {
      const groupedBills = await this.groupGasBillsByTimeUseCase.execute(id);
      return this.responseSuccess<GroupedGasBillsDto[]>(
        groupedBills,
        'Facturas de gas agrupadas por tiempo recuperadas correctamente',
      );
    } catch (error: any) {
      throw new HttpException('Error al obtener facturas de gas agrupadas por tiempo', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updateGasBillDto: UpdateGasBillDto) {
    try {
      const gasBill = await this.updateGasBillUseCase.execute(id, updateGasBillDto);
      return this.responseSuccess(gasBill, 'Factura de gas actualizada correctamente');
    } catch (error) {
      if (error instanceof GasBillNotFoundException) {
        throw new HttpException(error.message, HttpStatus.NOT_FOUND);
      }
      if (error instanceof InvalidGasBillDataException) {
        throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
      }
      throw new HttpException('Error al actualizar factura de gas', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    try {
      await this.deleteGasBillUseCase.execute(id);
      return this.responseSuccess(null, 'Factura de gas eliminada correctamente');
    } catch (error) {
      if (error instanceof GasBillNotFoundException) {
        throw new HttpException(error.message, HttpStatus.NOT_FOUND);
      }
      throw new HttpException('Error al eliminar factura de gas', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
} 