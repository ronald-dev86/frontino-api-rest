import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, HttpStatus, Inject, HttpException } from '@nestjs/common';
import { CreateClientUseCase } from '../../application/use-cases/create-client.use-case';
import { GetAllClientsUseCase } from '../../application/use-cases/get-all-clients.use-case';
import { GetClientByIdUseCase } from '../../application/use-cases/get-client-by-id.use-case';
import { UpdateClientUseCase } from '../../application/use-cases/update-client.use-case';
import { DeleteClientUseCase } from '../../application/use-cases/delete-client.use-case';
import { CreateClientDto } from '../../application/dtos/create-client.dto';
import { UpdateClientDto } from '../../application/dtos/update-client.dto';
import { BaseController } from '../../../shared/infrastructure/controllers/base.controller';
import { ClientNotFoundException } from '../../domain/exceptions/client-not-found.exception';
import { InvalidClientDataException } from '../../domain/exceptions/invalid-client-data.exception';

@Controller('clients')
export class ClientController extends BaseController {
  constructor(
    @Inject(CreateClientUseCase)
    private readonly createClientUseCase: CreateClientUseCase,
    @Inject(GetAllClientsUseCase)
    private readonly getAllClientsUseCase: GetAllClientsUseCase,
    @Inject(GetClientByIdUseCase)
    private readonly getClientByIdUseCase: GetClientByIdUseCase,
    @Inject(UpdateClientUseCase)
    private readonly updateClientUseCase: UpdateClientUseCase,
    @Inject(DeleteClientUseCase)
    private readonly deleteClientUseCase: DeleteClientUseCase,
  ) {
    super();
  }

  @Post()
  async create(@Body() createClientDto: CreateClientDto) {
    try {
      const client = await this.createClientUseCase.execute(createClientDto);
      return this.responseCreated(client, 'Cliente creado correctamente');
    } catch (error) {
      if (error instanceof InvalidClientDataException) {
        throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
      }
      throw new HttpException('Error al crear cliente', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get()
  async findAll() {
    try {
      const clients = await this.getAllClientsUseCase.execute();
      return this.responseSuccess(clients, 'Clientes recuperados correctamente');
    } catch (error) {
      throw new HttpException('Error al obtener clientes', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get('/:id')
  async findOne(@Param('id') id: string) {
    try {
      const client = await this.getClientByIdUseCase.execute(id);
      return this.responseSuccess(client, 'Cliente recuperado correctamente');
    } catch (error) {
      if (error instanceof ClientNotFoundException) {
        throw new HttpException(error.message, HttpStatus.NOT_FOUND);
      }
      throw new HttpException('Error al obtener cliente', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateClientDto: UpdateClientDto) {
    try {
      const client = await this.updateClientUseCase.execute(id, updateClientDto);
      return this.responseSuccess(client, 'Cliente actualizado correctamente');
    } catch (error) {
      if (error instanceof ClientNotFoundException) {
        throw new HttpException(error.message, HttpStatus.NOT_FOUND);
      }
      if (error instanceof InvalidClientDataException) {
        throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
      }
      throw new HttpException('Error al actualizar cliente', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    try {
      await this.deleteClientUseCase.execute(id);
      return this.responseSuccess(null, 'Cliente eliminado correctamente');
    } catch (error) {
      if (error instanceof ClientNotFoundException) {
        throw new HttpException(error.message, HttpStatus.NOT_FOUND);
      }
      throw new HttpException('Error al eliminar cliente', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
} 