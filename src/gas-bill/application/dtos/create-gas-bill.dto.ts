import { IsDateString, IsNotEmpty, IsNumber, IsPositive, IsString, IsUUID } from 'class-validator';

export class CreateGasBillDto {
  @IsNotEmpty()
  @IsUUID()
  idMember: string;

  @IsNotEmpty()
  @IsDateString()
  time: string;

  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  m3: number;

  @IsNotEmpty()
  @IsString()
  urlPhoto: string;
} 