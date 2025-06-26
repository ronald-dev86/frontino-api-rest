import { IsArray, IsBoolean, IsEmail, IsEnum, IsOptional, IsString } from 'class-validator';
import { Roles } from '../../domain/enums/roles.enum';

export class UpdateUserDto {
  @IsArray()
  @IsOptional()
  idAssociatedAccounts?: string[];

  @IsEmail()
  @IsOptional()
  email?: string;

  @IsString()
  @IsOptional()
  password?: string;

  @IsEnum(Roles)
  @IsOptional()
  rol?: Roles;

  @IsBoolean()
  @IsOptional()
  active?: boolean;
} 