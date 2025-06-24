import { HttpStatus } from '@nestjs/common';

export class ApiResponse<T> {
  status: number;
  message: string;
  data: T | null;

  private constructor(status: number, message: string, data: T | null) {
    this.status = status;
    this.message = message;
    this.data = data;
  }

  static success<T>(message: string, data: T, status: number = HttpStatus.OK): ApiResponse<T> {
    return new ApiResponse(status, message, data);
  }

  static created<T>(message: string, data: T): ApiResponse<T> {
    return new ApiResponse(HttpStatus.CREATED, message, data);
  }

  static error(message: string, status: number = HttpStatus.INTERNAL_SERVER_ERROR): ApiResponse<null> {
    return new ApiResponse<null>(status, message, null);
  }

  static notFound(message: string): ApiResponse<null> {
    return new ApiResponse<null>(HttpStatus.NOT_FOUND, message, null);
  }

  static badRequest(message: string): ApiResponse<null> {
    return new ApiResponse<null>(HttpStatus.BAD_REQUEST, message, null);
  }

  static conflict(message: string): ApiResponse<null> {
    return new ApiResponse<null>(HttpStatus.CONFLICT, message, null);
  }
} 