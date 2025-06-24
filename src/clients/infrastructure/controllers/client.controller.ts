import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, HttpStatus, Inject } from '@nestjs/common';
import { CreateClientUseCase } from '../../application/use-cases/create-client.use-case';
import { GetAllClientsUseCase } from '../../application/use-cases/get-all-clients.use-case';
import { GetClientByIdUseCase } from '../../application/use-cases/get-client-by-id.use-case';
import { UpdateClientUseCase } from '../../application/use-cases/update-client.use-case';
import { DeleteClientUseCase } from '../../application/use-cases/delete-client.use-case';
import { CreateClientDto } from '../../application/dtos/create-client.dto';
import { UpdateClientDto } from '../../application/dtos/update-client.dto';

@Controller('clients')
export class ClientController {
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
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createClientDto: CreateClientDto) {
    return this.createClientUseCase.execute(createClientDto);
  }

  @Get()
  findAll() {
    return this.getAllClientsUseCase.execute();
  }

  @Get('/:id')
  findOne(@Param('id') id: string) {
    return this.getClientByIdUseCase.execute(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateClientDto: UpdateClientDto) {
    return this.updateClientUseCase.execute(id, updateClientDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string) {
    return this.deleteClientUseCase.execute(id);
  }
} 