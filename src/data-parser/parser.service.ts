import { OnModuleInit } from '@nestjs/common';
import * as fs from 'fs';
import { DataSource } from 'typeorm';
import {
  Rate,
  Employee,
  Statement,
  Donation,
  Department,
} from '../db/entities';
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

    this.insertRates();
    this.insertDepartments();
    this.insertEmployees();
    this.insertStatements();
    this.insertDonations();
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

        let [key, value] = line.trim().split(':');
        key = key.toLowerCase();
        if (value != undefined) {
          value = value.trim();
        }

        switch (property) {
          case 'Employee':
            if (value != undefined) {
              if (key == 'id') {
                employee[key] = parseInt(value);
              } else {
                employee[key] = value;
              }
            }

            break;
          case 'Donation':
            if (value != undefined) {
              if (key == 'id') {
                donation[key] = parseInt(value);
              } else if (key == 'amount') {
                const [amount, currency] = value.split(' ');
                donation[key] = parseFloat(amount);
                donation.currency = currency;
              } else {
                donation[key] = value;
              }
            }
            if (Object.entries(donation).length == 4) {
              donations.push(donation);
              donation = {};
            }

            break;
          case 'Department':
            if (value != undefined) {
              department[key] = value;
            }

            break;
          case 'Salary':
            if (value != undefined) {
              if (key == 'id') {
                statement[key] = parseInt(value);
              } else if (key == 'amount') {
                statement[key] = parseFloat(value);
              } else {
                statement[key] = value;
              }
            }
            if (Object.entries(statement).length == 3) {
              salaries.push(statement);
              statement = {};
            }

            break;
          case 'Rate':
            if (value != undefined) {
              rate[key] = value;
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
  }

  insertRates() {
    this.parsedRates.forEach((parsedRate, index) => {
      const rate = new Rate(
        index + 1,
        new Date(parsedRate.date),
        parsedRate.value,
        parsedRate.sign.trim(),
      );

      this.dataSource.manager.save(rate);
    });
  }

  insertDepartments() {
    this.parsedEmployees.forEach((parsedEmployee) => {
      const department = new Department(
        parsedEmployee.department.id,
        parsedEmployee.department.name,
      );

      this.dataSource
        .createQueryBuilder()
        .insert()
        .into(Department)
        .values(department)
        .orIgnore()
        .execute();
    });
  }

  insertEmployees() {
    this.parsedEmployees.forEach((parsedEmployee) => {
      const employee = new Employee(
        parseInt(parsedEmployee.id),
        parsedEmployee.name,
        parsedEmployee.surname,
        parsedEmployee.department,
        parsedEmployee.statements,
        parsedEmployee.donations,
      );

      this.dataSource.manager.save(employee);
    });
  }

  insertStatements() {
    this.parsedEmployees.forEach((parsedEmployee) => {
      parsedEmployee.salaries.forEach((parsedStatement) => {
        const statement = new Statement(
          parsedStatement.id,
          new Date(parsedStatement.date),
          parsedStatement.amount,
          parsedEmployee,
        );

        this.dataSource.manager.save(statement);
      });
    });
  }

  async insertDonations() {
    let date = null;

    for (const parsedEmployee of this.parsedEmployees) {
      if (parsedEmployee.donations != undefined) {
        for (const parsedDonation of parsedEmployee.donations) {
          date = new Date(parsedDonation.date);

          const rate = await this.getUSDRateByDate(
            date,
            parsedDonation.currency,
          );

          const amount_in_usd = parseFloat(
            (rate * parsedDonation.amount).toFixed(2),
          );

          const donation = new Donation(
            parsedDonation.id,
            date,
            parsedDonation.amount,
            parsedDonation.currency,
            parsedDonation.currency == 'USD'
              ? parsedDonation.amount
              : amount_in_usd,
            parsedEmployee,
          );

          this.dataSource.manager.save(donation);
        }
      }
    }
  }

  getUSDRateByDate = async (date: Date, sign: string) => {
    const query = `SELECT value
        FROM rates
      WHERE sign = $1
      AND created_at = $2`;

    const result = await this.dataSource.query(query, [sign, date]);
    return result[0] ? result[0].value : null;
  };
}
