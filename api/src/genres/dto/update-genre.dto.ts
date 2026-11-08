import { IsNotEmpty, IsString, IsOptional } from 'class-validator';

export class UpdateGenreDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  slug?: string;
}
