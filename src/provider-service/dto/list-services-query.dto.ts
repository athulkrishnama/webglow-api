import {
  IsDateString,
  IsNumberString,
  IsOptional,
  IsString,
} from 'class-validator';

export class ListServicesQueryDto {
  @IsOptional()
  @IsNumberString()
  page?: string;

  @IsOptional()
  @IsNumberString()
  limit?: string;

  @IsOptional()
  @IsString()
  category?: string;

  @IsOptional()
  @IsNumberString()
  minPrice?: string;

  @IsOptional()
  @IsNumberString()
  maxPrice?: string;

  @IsOptional()
  @IsNumberString()
  lat?: string;

  @IsOptional()
  @IsNumberString()
  lng?: string;

  @IsOptional()
  @IsNumberString()
  radiusKm?: string;

  @IsOptional()
  @IsDateString()
  availableFrom?: string;

  @IsOptional()
  @IsDateString()
  availableTo?: string;

  @IsOptional()
  @IsString()
  search?: string;
}
