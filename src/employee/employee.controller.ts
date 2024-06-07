import { Controller, Get } from '@nestjs/common';
import { EmployeeService } from './employee.service';
import { RewardedEmployeeDto } from './dto';

@Controller('employees')
export class EmployeeController {
  constructor(private readonly employeeService: EmployeeService) {}
  @Get('reward')
  calculateRewards(): Promise<RewardedEmployeeDto[]> {
    return this.employeeService.calculateRewards();
  }
}
