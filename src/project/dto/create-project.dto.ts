import { IsNotEmpty, IsString } from 'class-validator';

export class CreateProjectDto {
  @IsString()
  @IsNotEmpty()
  project_name: string;
  @IsString()
  @IsNotEmpty()
  dockerImage_id: string;
}
