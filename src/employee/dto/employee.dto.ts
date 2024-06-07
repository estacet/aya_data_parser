import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class RewardedEmployeeDto {
  @IsNotEmpty()
  @IsNumber()
  id: number;

  @IsNotEmpty()
  @IsString()
  reward: string;
}
