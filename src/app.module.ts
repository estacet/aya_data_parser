import { Module } from '@nestjs/common';
import { ParserService } from './data-parser/parser.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppDataSource } from './db/data-source';
import { EmployeeModule } from './employee/employee.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({ ...AppDataSource.options }),
    EmployeeModule,
  ],
  providers: [ParserService],
})
export class AppModule {}
