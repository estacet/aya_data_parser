import { Injectable } from '@nestjs/common';
import { EmployeeRepository } from './employee.repository';

@Injectable()
export class EmployeeService {
  constructor(private employeeRepository: EmployeeRepository) {}
  async calculateRewards() {
    let result;
    try {
      result = await this.employeeRepository.calculateRewards();
      return result;
    } catch (error) {
      throw error;
    }
  }
}
