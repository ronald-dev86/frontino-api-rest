import { IsOptional, IsNumber, IsString, Min, Max } from 'class-validator';

export class UpdateGasCylinderRefillDto {
  @IsNumber()
  @Min(0)
  @Max(100)
  @IsOptional()
  fillingPercentage?: number;

  @IsString()
  @IsOptional()
  fillingTime?: string;

  @IsString()
  @IsOptional()
  urlVoucher?: string;
} 