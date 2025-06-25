import { IsDateString, IsNumber, IsOptional, IsPositive, IsString, IsUUID } from 'class-validator';

export class UpdateGasBillDto {
  @IsOptional()
  @IsUUID()
  idMember?: string;

  @IsOptional()
  @IsDateString()
  time?: string;

  @IsOptional()
  @IsNumber()
  @IsPositive()
  m3?: number;

  @IsOptional()
  @IsString()
  urlPhoto?: string;
} 