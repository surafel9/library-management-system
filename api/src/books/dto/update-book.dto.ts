import { IsString, IsInt, IsOptional, Min } from 'class-validator';

export class UpdateBookDto {
  @IsString()
  @IsOptional()
  title?: string;

  @IsString()
  @IsOptional()
  author?: string;

  @IsString()
  @IsOptional()
  isbn?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  coverImage?: string;

  @IsInt()
  @Min(1)
  @IsOptional()
  totalCopies?: number;

  @IsInt()
  @Min(0)
  @IsOptional()
  availableCopies?: number;

  @IsInt()
  @IsOptional()
  genreId?: number;
}
