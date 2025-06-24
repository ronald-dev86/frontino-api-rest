import { Controller, Get, Post, Put, Delete, Body, Param, HttpStatus, HttpException } from '@nestjs/common';
import { CreateMemberUseCase } from '../../application/use-cases/create-member.use-case';
import { GetMemberByIdUseCase } from '../../application/use-cases/get-member-by-id.use-case';
import { GetAllMembersUseCase } from '../../application/use-cases/get-all-members.use-case';
import { UpdateMemberUseCase } from '../../application/use-cases/update-member.use-case';
import { DeleteMemberUseCase } from '../../application/use-cases/delete-member.use-case';
import { GetAllMembersByClientIdUseCase } from '../../application/use-cases/get-all-members-by-client-id.use-case';
import { CreateMemberDto } from '../../application/dtos/create-member.dto';
import { UpdateMemberDto } from '../../application/dtos/update-member.dto';
import { MemberNotFoundException } from '../../domain/exceptions/member-not-found.exception';
import { InvalidMemberDataException } from '../../domain/exceptions/invalid-member-data.exception';
import { DuplicateMeterSerialException } from '../../domain/exceptions/duplicate-meter-serial.exception';
import { BaseController } from '../../../shared/infrastructure/controllers/base.controller';

@Controller('members')
export class MemberController extends BaseController {
  constructor(
    private readonly createMemberUseCase: CreateMemberUseCase,
    private readonly getMemberByIdUseCase: GetMemberByIdUseCase,
    private readonly getAllMembersUseCase: GetAllMembersUseCase,
    private readonly updateMemberUseCase: UpdateMemberUseCase,
    private readonly deleteMemberUseCase: DeleteMemberUseCase,
    private readonly getAllMembersByClientIdUseCase: GetAllMembersByClientIdUseCase,
  ) {
    super();
  }

  @Post()
  async create(@Body() createMemberDto: CreateMemberDto) {
    try {
      const member = await this.createMemberUseCase.execute(createMemberDto);
      return this.responseCreated(member, 'Miembro creado correctamente');
    } catch (error) {
      if (error instanceof InvalidMemberDataException) {
        throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
      }
      if (error instanceof DuplicateMeterSerialException) {
        throw new HttpException(error.message, HttpStatus.CONFLICT);
      }
      throw new HttpException('Error al crear miembro', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get()
  async findAll() {
    try {
      const members = await this.getAllMembersUseCase.execute();
      return this.responseSuccess(members, 'Miembros recuperados correctamente');
    } catch (error) {
      throw new HttpException('Error al obtener miembros', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get(':id')
  async findById(@Param('id') id: string) {
    try {
      const member = await this.getMemberByIdUseCase.execute(id);
      return this.responseSuccess(member, 'Miembro recuperado correctamente');
    } catch (error) {
      if (error instanceof MemberNotFoundException) {
        throw new HttpException(error.message, HttpStatus.NOT_FOUND);
      }
      throw new HttpException('Error al obtener miembro', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get('client/:clientId')
  async findAllByClientId(@Param('clientId') clientId: string) {
    try {
      const members = await this.getAllMembersByClientIdUseCase.execute(clientId);
      return this.responseSuccess(members, 'Miembros recuperados correctamente por ID de cliente');
    } catch (error) {
      throw new HttpException('Error al obtener miembros por ID de cliente', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updateMemberDto: UpdateMemberDto) {
    try {
      const member = await this.updateMemberUseCase.execute(id, updateMemberDto);
      return this.responseSuccess(member, 'Miembro actualizado correctamente');
    } catch (error) {
      if (error instanceof MemberNotFoundException) {
        throw new HttpException(error.message, HttpStatus.NOT_FOUND);
      }
      if (error instanceof InvalidMemberDataException) {
        throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
      }
      if (error instanceof DuplicateMeterSerialException) {
        throw new HttpException(error.message, HttpStatus.CONFLICT);
      }
      throw new HttpException('Error al actualizar miembro', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    try {
      await this.deleteMemberUseCase.execute(id);
      return this.responseSuccess(null, 'Miembro eliminado correctamente');
    } catch (error) {
      if (error instanceof MemberNotFoundException) {
        throw new HttpException(error.message, HttpStatus.NOT_FOUND);
      }
      throw new HttpException('Error al eliminar miembro', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
} 