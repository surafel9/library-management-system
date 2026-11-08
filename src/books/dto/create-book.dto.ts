import { IsNotEmpty, IsString, IsInt, IsOptional, Min } from 'class-validator';

export class CreateBookDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  author: string;

  @IsString()
  @IsNotEmpty()
  isbn: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsString()
  @IsOptional()
  coverImage?: string;

  @IsInt()
  @Min(1)
  @IsOptional()
  totalCopies?: number;

  @IsInt()
  @IsNotEmpty()
  genreId: number;
}
