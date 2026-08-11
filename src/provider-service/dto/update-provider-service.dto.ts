import {
  IsString,
  IsNumber,
  IsOptional,
  ValidateNested,
  IsBoolean,
  IsArray,
  IsEnum,
  ArrayMinSize,
  IsDateString,
  IsIn,
} from 'class-validator';
import { Type } from 'class-transformer';
import { PROVIDER_CATEGORIES } from '../../common/constants/provider-categories.constant';

class UpdateLocationDto {
  @IsString()
  @IsEnum(['Point'])
  @IsOptional()
  type?: string;

  @IsArray()
  @ArrayMinSize(2)
  @IsNumber({}, { each: true })
  @IsOptional()
  coordinates?: number[];

  @IsString()
  @IsOptional()
  address?: string;

  @IsString()
  @IsOptional()
  city?: string;

  @IsString()
  @IsOptional()
  state?: string;

  @IsString()
  @IsOptional()
  zipCode?: string;
}

class UpdateAvailabilityDto {
  @IsDateString()
  @IsOptional()
  startDate?: string;

  @IsDateString()
  @IsOptional()
  endDate?: string;
}

export class UpdateProviderServiceDto {
  @IsString()
  @IsOptional()
  title?: string;

  @IsString()
  @IsIn(PROVIDER_CATEGORIES)
  @IsOptional()
  category?: string;

  @IsNumber()
  @IsOptional()
  pricePerDay?: number;

  @IsString()
  @IsOptional()
  description?: string;

  @ValidateNested()
  @Type(() => UpdateLocationDto)
  @IsOptional()
  location?: UpdateLocationDto;

  @IsString()
  @IsOptional()
  contact?: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => UpdateAvailabilityDto)
  @IsOptional()
  availability?: UpdateAvailabilityDto[];

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}
