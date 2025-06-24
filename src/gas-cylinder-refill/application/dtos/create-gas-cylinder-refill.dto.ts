import { IsNotEmpty, IsNumber, IsString, IsUUID, Min, Max } from 'class-validator';

export class CreateGasCylinderRefillDto {
  @IsUUID(4)
  @IsNotEmpty()
  idGasCylinder: string;

  @IsNumber()
  @Min(0)
  @Max(100)
  @IsNotEmpty()
  fillingPercentage: number;

  @IsString()
  @IsNotEmpty()
  fillingTime: string;

  @IsString()
  @IsNotEmpty()
  urlVoucher: string;
} 