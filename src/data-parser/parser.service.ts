import { OnModuleInit } from '@nestjs/common';
import * as fs from 'fs';
import { DataSource } from 'typeorm';
import { Rate, Employee, Statement, Donation, Department } from "../db/entities";
import { AppDataSource } from '../db/data-source';

export class ParserService implements OnModuleInit {
  parsedRates = [];
  parsedEmployees = [];

  constructor(private dataSource: DataSource) {
    this.dataSource = AppDataSource;
  }
  onModuleInit(): any {
    const dumpText = fs.readFileSync('./init_db/dump.txt', 'utf8');
    this.parse(dumpText);

    this.insertValuesIntoDb();
  }

  parse(data: string) {
    const dataArray = data.split('\n');
    const ratesIndex = dataArray.indexOf('Rates');
    const employeesPart = dataArray.slice(1, ratesIndex);
    const ratesPart = dataArray.slice(ratesIndex);
    const employees = this.splitArrayByInstances(employeesPart, '  Employee');
    employees.forEach((employee: string[]) => {
      this.parsedEmployees.push(this.parseTxtToObj(employee));
    });

    const rates = this.splitArrayByInstances(ratesPart, '  Rate');
    rates.forEach((rate: string[]) => {
      this.parsedRates.push(this.parseTxtToObj(rate));
    });
  }

  splitArrayByInstances(array: string[], instance: string): string[][] {
    const splitIndexes: number[] = [];

    array.forEach((line, index) => {
      line.startsWith(instance) && splitIndexes.push(index);
    });

    const dividedInstances: string[][] = [];

    for (let i = 0; i < splitIndexes.length; i++) {
      const start = splitIndexes[i];
      const end =
        i < splitIndexes.length - 1 ? splitIndexes[i + 1] : array.length;
      dividedInstances.push(array.slice(start, end));
    }

    return dividedInstances;
  }

  parseTxtToObj(employeePart: string[]): Employee | Rate {
    const lines = employeePart.filter((line) => line !== '');

    let employee = null;
    employee = {};
    const donations: Donation[] = [];
    let donation = null;
    const salaries: Statement[] = [];
    let statement = null;
    let department = null;
    let parsedRate = null;
    let rate = null;
    donation = {};
    statement = {};
    department = {};
    parsedRate = {};
    rate = {};

    const propertiesParts: string[][] =
      this.getEmployeePropertiesInParts(lines);

    propertiesParts.forEach((part) => {
      const property = part[0].trim();
      for (const line of part) {
        line.trim();

        const [key, value] = line.trim().split(':');
        const lowerCaseKey = key.toLowerCase();

        if (key == 'amount') {
          parseFloat(value);
        }

        switch (property) {
          case 'Employee':
            if (value != undefined) {
              employee[lowerCaseKey] = value;
            }

            break;
          case 'Donation':
            if (value != undefined) {
              donation[lowerCaseKey] = value;
            }
            if (Object.entries(donation).length == 3) {
              donations.push(donation);
              donation = {};
            }

            break;
          case 'Department':
            if (value != undefined) {
              department[lowerCaseKey] = value;
            }

            break;
          case 'Salary':
            if (value != undefined) {
              statement[lowerCaseKey] = value;
            }
            if (Object.entries(statement).length == 3) {
              salaries.push(statement);
              statement = {};
            }

            break;
          case 'Rate':
            if (value != undefined) {
              rate[lowerCaseKey] = value;
            }

            if (Object.entries(rate).length == 3) {
              parsedRate = rate;
              rate = {};
            }
            break;
        }
      }
    });

    if (Object.entries(department).length > 0) {
      employee.department = department;
    }

    if (salaries.length > 0) {
      employee.salaries = salaries;
    }

    if (donations.length > 0) {
      employee.donations = donations;
    }

    if (Object.entries(parsedRate).length == 3) {
      return parsedRate;
    }

    return employee;
  }

  getEmployeePropertiesInParts(lines: string[]) {
    const parts: string[][] = [];
    let currentPart: string[] = [];

    const startRegex = /^ {4}[A-Z]/;
    const endRegex = /^ {8}[A-Z]/;

    for (const line of lines) {
      if (startRegex.test(line)) {
        if (currentPart.length > 0) {
          parts.push(currentPart);
        }
        currentPart = [line];
      } else {
        currentPart.push(line);
      }

      if (endRegex.test(line)) {
        parts.push(currentPart);
        currentPart = [];
      }
    }

    if (currentPart.length > 0) {
      parts.push(currentPart);
    }

    return parts;
  };

  insertValuesIntoDb() {
    this.parsedRates.forEach((parsedRate, index) => {
      const rate = new Rate(
        index + 1,
        new Date(),
        parsedRate.value,
        parsedRate.sign.trim(),
      );
      this.dataSource.manager.save(rate);
    });

    this.parsedEmployees.forEach((parsedEmployee) => {
      const department = new Department(
        parsedEmployee.department.id,
        parsedEmployee.department.name,
      );

      this.dataSource.manager.save(department);
    });
  }
}
