import { IsBoolean, IsDateString, IsNotEmpty, IsString, Matches } from 'class-validator';

export class TaskDto {
  @IsString()
  @IsNotEmpty({ message: 'id is required' })
  id!: string;

  @IsBoolean()
  complete!: boolean;

  @Matches(/^\d{2}\/\d{2}\/\d{4}$/, {
    message: 'created must be a valid date in the format DD/MM/YYYY',
  })
  created!: string;

  @IsString()
  @IsNotEmpty()
  description!: string;

  @IsDateString()
  due!: string;

  @IsString()
  @IsNotEmpty()
  title!: string;
}
