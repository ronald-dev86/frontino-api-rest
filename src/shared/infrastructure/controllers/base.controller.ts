import { HttpStatus } from '@nestjs/common';
import { ApiResponse } from '../response/api-response';

export abstract class BaseController {
  protected responseCreated<T>(data: T, message: string = 'Recurso creado correctamente'): ApiResponse<T> {
    return ApiResponse.created(message, data);
  }

  protected responseSuccess<T>(data: T, message: string = 'Operación exitosa'): ApiResponse<T> {
    return ApiResponse.success(message, data);
  }

  protected responseError(message: string = 'Error en la operación', status: number = HttpStatus.INTERNAL_SERVER_ERROR): ApiResponse<null> {
    return ApiResponse.error(message, status);
  }

  protected responseNotFound(message: string = 'Recurso no encontrado'): ApiResponse<null> {
    return ApiResponse.notFound(message);
  }

  protected responseBadRequest(message: string = 'Solicitud inválida'): ApiResponse<null> {
    return ApiResponse.badRequest(message);
  }

  protected responseConflict(message: string = 'Conflicto de recursos'): ApiResponse<null> {
    return ApiResponse.conflict(message);
  }
} 