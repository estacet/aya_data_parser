import { Module } from '@nestjs/common';
import { EmployeeRepository } from './employee.repository';
import { EmployeeService } from './employee.service';

@Module({
  controllers: [],
  providers: [EmployeeService, EmployeeRepository],
})
export class EmployeeModule {}
