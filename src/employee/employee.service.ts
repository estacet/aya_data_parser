import { Injectable } from '@nestjs/common';
import { EmployeeRepository } from './employee.repository';
import { RewardedEmployeeDto } from './dto';

@Injectable()
export class EmployeeService {
  constructor(private employeeRepository: EmployeeRepository) {}
  async calculateRewards() {
    try {
      const rewardedEmployees: RewardedEmployeeDto[] =
        await this.employeeRepository.calculateRewards();
      rewardedEmployees.forEach((employee: RewardedEmployeeDto) => {
        const reward = parseInt(employee.reward).toFixed(2);
        employee.reward = `${reward}` + ' USD';
      });
      return rewardedEmployees;
    } catch (error) {
      throw error;
    }
  }
}
