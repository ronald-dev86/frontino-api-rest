import { Controller, Get, Post, Body, Param, Delete, HttpException, HttpStatus, Inject } from '@nestjs/common';
import { CreateAuthUseCase } from '../../application/use-cases/create-auth.use-case';
import { GetAuthByIdUseCase } from '../../application/use-cases/get-auth-by-id.use-case';
import { FindByTokenAuthUseCase } from '../../application/use-cases/find-by-token-auth.use-case';
import { DeleteAuthUseCase } from '../../application/use-cases/delete-auth.use-case';
import { LoginUseCase } from '../../application/use-cases/login.use-case';
import { LogoutUseCase } from '../../application/use-cases/logout.use-case';
import { RefreshTokenUseCase } from '../../application/use-cases/refresh-token.use-case';
import { ResetPasswordUseCase } from '../../application/use-cases/reset-password.use-case';
import { CreateAuthDto } from '../../application/dtos/create-auth.dto';
import { LoginDto } from '../../application/dtos/login.dto';
import { RefreshTokenDto } from '../../application/dtos/refresh-token.dto';
import { ResetPasswordDto } from '../../application/dtos/reset-password.dto';
import { BaseController } from '../../../shared/infrastructure/controllers/base.controller';
import { AuthNotFoundException } from '../../domain/exceptions/auth-not-found.exception';
import { TokenNotFoundException } from '../../domain/exceptions/token-not-found.exception';
import { InvalidCredentialsException } from '../../domain/exceptions/invalid-credentials.exception';
import { AuthResponseAdapter } from '../adapters/auth-response.adapter';

@Controller('auth')
export class AuthController extends BaseController {
  constructor(
    @Inject(CreateAuthUseCase)
    private readonly createAuthUseCase: CreateAuthUseCase,
    @Inject(GetAuthByIdUseCase)
    private readonly getAuthByIdUseCase: GetAuthByIdUseCase,
    @Inject(FindByTokenAuthUseCase)
    private readonly findByTokenAuthUseCase: FindByTokenAuthUseCase,
    @Inject(DeleteAuthUseCase)
    private readonly deleteAuthUseCase: DeleteAuthUseCase,
    @Inject(LoginUseCase)
    private readonly loginUseCase: LoginUseCase,
    @Inject(LogoutUseCase)
    private readonly logoutUseCase: LogoutUseCase,
    @Inject(RefreshTokenUseCase)
    private readonly refreshTokenUseCase: RefreshTokenUseCase,
    @Inject(ResetPasswordUseCase)
    private readonly resetPasswordUseCase: ResetPasswordUseCase,
  ) {
    super();
  }

  @Post()
  async create(@Body() createAuthDto: CreateAuthDto) {
    try {
      const auth = await this.createAuthUseCase.execute(createAuthDto);
      const authResponse = AuthResponseAdapter.toResponseDto(auth);
      return this.responseCreated(
        authResponse,
        'Autenticación creada correctamente',
      );
    } catch (error) {
      throw new HttpException(
        'Error al crear autenticación',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    try {
      const auth = await this.getAuthByIdUseCase.execute(id);
      const authResponse = AuthResponseAdapter.toResponseDto(auth);
      return this.responseSuccess(
        authResponse,
        'Autenticación recuperada correctamente',
      );
    } catch (error) {
      if (error instanceof AuthNotFoundException) {
        throw new HttpException(error.message, HttpStatus.NOT_FOUND);
      }
      throw new HttpException(
        'Error al obtener autenticación',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('token/:token')
  async findByToken(@Param('token') token: string) {
    try {
      const auth = await this.findByTokenAuthUseCase.execute(token);
      const authResponse = AuthResponseAdapter.toResponseDto(auth);
      return this.responseSuccess(
        authResponse,
        'Autenticación recuperada correctamente',
      );
    } catch (error) {
      if (error instanceof TokenNotFoundException) {
        throw new HttpException(error.message, HttpStatus.NOT_FOUND);
      }
      throw new HttpException(
        'Error al obtener autenticación',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    try {
      await this.deleteAuthUseCase.execute(id);
      return this.responseSuccess(
        null,
        'Autenticación eliminada correctamente',
      );
    } catch (error) {
      if (error instanceof AuthNotFoundException) {
        throw new HttpException(error.message, HttpStatus.NOT_FOUND);
      }
      throw new HttpException(
        'Error al eliminar autenticación',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    try {
      const auth = await this.loginUseCase.execute(loginDto);
      const authResponse = AuthResponseAdapter.toResponseDto(auth);
      return this.responseCreated(authResponse, 'Inicio de sesión exitoso');
    } catch (error) {
      if (error instanceof InvalidCredentialsException) {
        throw new HttpException(error.message, HttpStatus.UNAUTHORIZED);
      }
      throw new HttpException(
        'Error al iniciar sesión',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post('logout')
  async logout(@Body() { token }: { token: string }) {
    try {
      await this.logoutUseCase.execute(token);
      return this.responseSuccess(null, 'Cierre de sesión exitoso');
    } catch (error) {
      if (error instanceof TokenNotFoundException) {
        throw new HttpException(error.message, HttpStatus.NOT_FOUND);
      }
      throw new HttpException(
        'Error al cerrar sesión',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post('refresh-token')
  async refreshToken(@Body() refreshTokenDto: RefreshTokenDto) {
    try {
      const auth = await this.refreshTokenUseCase.execute(refreshTokenDto);
      const authResponse = AuthResponseAdapter.toResponseDto(auth);
      return this.responseSuccess(
        authResponse,
        'Token actualizado correctamente',
      );
    } catch (error) {
      if (error instanceof TokenNotFoundException) {
        throw new HttpException(error.message, HttpStatus.NOT_FOUND);
      }
      throw new HttpException(
        'Error al actualizar token',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post('reset-password')
  async resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
    try {
      await this.resetPasswordUseCase.execute(resetPasswordDto);
      return this.responseSuccess(null, 'Contraseña actualizada correctamente');
    } catch (error) {
      if (error instanceof InvalidCredentialsException) {
        throw new HttpException(error.message, HttpStatus.UNAUTHORIZED);
      }
      throw new HttpException(
        'Error al actualizar contraseña',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}