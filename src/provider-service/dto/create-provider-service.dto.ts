import {
  IsString,
  IsNotEmpty,
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

class LocationDto {
  @IsString()
  @IsEnum(['Point'])
  @IsOptional()
  type: string = 'Point';

  @IsArray()
  @ArrayMinSize(2)
  @IsNumber({}, { each: true })
  coordinates: number[]; // [longitude, latitude]

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

class AvailabilityDto {
  @IsDateString()
  @IsNotEmpty()
  startDate: string;

  @IsDateString()
  @IsNotEmpty()
  endDate: string;
}

export class CreateProviderServiceDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  @IsIn(PROVIDER_CATEGORIES)
  category: string;

  @IsNumber()
  @IsNotEmpty()
  pricePerDay: number;

  @IsString()
  @IsNotEmpty()
  description: string;

  @ValidateNested()
  @Type(() => LocationDto)
  @IsNotEmpty()
  location: LocationDto;

  @IsString()
  @IsOptional()
  contact?: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AvailabilityDto)
  @IsOptional()
  availability?: AvailabilityDto[];

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}
