import { Controller, Get, Post, Put, Delete, Body, Param, HttpStatus, HttpException, Query } from '@nestjs/common';
import { CreateUserUseCase } from '../../application/use-cases/create-user.use-case';
import { GetUserByIdUseCase } from '../../application/use-cases/get-user-by-id.use-case';
import { GetAllUsersUseCase } from '../../application/use-cases/get-all-users.use-case';
import { UpdateUserUseCase } from '../../application/use-cases/update-user.use-case';
import { DeleteUserUseCase } from '../../application/use-cases/delete-user.use-case';
import { FindByEmailUserUseCase } from '../../application/use-cases/find-by-email-user.use-case';
import { CreateUserDto } from '../../application/dtos/create-user.dto';
import { UpdateUserDto } from '../../application/dtos/update-user.dto';
import { UserNotFoundException } from '../../domain/exceptions/user-not-found.exception';
import { InvalidUserDataException } from '../../domain/exceptions/invalid-user-data.exception';
import { EmailAlreadyExistsException } from '../../domain/exceptions/email-already-exists.exception';
import { BaseController } from '../../../shared/infrastructure/controllers/base.controller';

@Controller('users')
export class UserController extends BaseController {
  constructor(
    private readonly createUserUseCase: CreateUserUseCase,
    private readonly getUserByIdUseCase: GetUserByIdUseCase,
    private readonly getAllUsersUseCase: GetAllUsersUseCase,
    private readonly updateUserUseCase: UpdateUserUseCase,
    private readonly deleteUserUseCase: DeleteUserUseCase,
    private readonly findByEmailUserUseCase: FindByEmailUserUseCase,
  ) {
    super();
  }

  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    try {
      const user = await this.createUserUseCase.execute(createUserDto);
      return this.responseCreated(user, 'Usuario creado correctamente');
    } catch (error) {
      if (error instanceof InvalidUserDataException) {
        throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
      }
      if (error instanceof EmailAlreadyExistsException) {
        throw new HttpException(error.message, HttpStatus.CONFLICT);
      }
      throw new HttpException('Error al crear usuario', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get()
  async findAll() {
    try {
      const users = await this.getAllUsersUseCase.execute();
      return this.responseSuccess(users, 'Usuarios recuperados correctamente');
    } catch (error) {
      throw new HttpException('Error al obtener usuarios', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get('email')
  async findByEmail(@Query('email') email: string) {
    try {
      const user = await this.findByEmailUserUseCase.execute(email);
      return this.responseSuccess(user, 'Usuario recuperado correctamente');
    } catch (error) {
      if (error instanceof Error && error.message.includes('no encontrado')) {
        throw new HttpException(error.message, HttpStatus.NOT_FOUND);
      }
      throw new HttpException('Error al buscar usuario por email', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get(':id')
  async findById(@Param('id') id: string) {
    try {
      const user = await this.getUserByIdUseCase.execute(id);
      return this.responseSuccess(user, 'Usuario recuperado correctamente');
    } catch (error) {
      if (error instanceof UserNotFoundException) {
        throw new HttpException(error.message, HttpStatus.NOT_FOUND);
      }
      throw new HttpException('Error al obtener usuario', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    try {
      const user = await this.updateUserUseCase.execute(id, updateUserDto);
      return this.responseSuccess(user, 'Usuario actualizado correctamente');
    } catch (error) {
      if (error instanceof UserNotFoundException) {
        throw new HttpException(error.message, HttpStatus.NOT_FOUND);
      }
      if (error instanceof InvalidUserDataException) {
        throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
      }
      if (error instanceof EmailAlreadyExistsException) {
        throw new HttpException(error.message, HttpStatus.CONFLICT);
      }
      throw new HttpException('Error al actualizar usuario', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    try {
      await this.deleteUserUseCase.execute(id);
      return this.responseSuccess(null, 'Usuario eliminado correctamente');
    } catch (error) {
      if (error instanceof UserNotFoundException) {
        throw new HttpException(error.message, HttpStatus.NOT_FOUND);
      }
      throw new HttpException('Error al eliminar usuario', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
} 