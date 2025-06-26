import { IsArray, IsBoolean, IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { Roles } from '../../domain/enums/roles.enum';

export class CreateUserDto {
  @IsArray()
  @IsOptional()
  idAssociatedAccounts?: string[];

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;

  @IsEnum(Roles)
  @IsNotEmpty()
  rol: Roles;

  @IsBoolean()
  @IsOptional()
  active?: boolean;
} 