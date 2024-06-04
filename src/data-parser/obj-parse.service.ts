import { OnModuleInit } from '@nestjs/common';
import * as fs from 'fs';
import * as path from "node:path";

type Employee = {
  id: string;
  name: string;
  surname: string;
  department: Department;
  salaries: Statement[];
  donations: Donation[];
};

type Statement = {
  id: string;
  amount: number;
  date: string;
};

type Department = {
  id: string;
  name: string;
};

type Donation = {
  id: string;
  date: string;
  amount: number;
};

type Rate = {
  date: string;
  sign: string;
  value: number;
};

export class ObjParseService implements OnModuleInit {
  onModuleInit(): any {
    const dumpText = fs.readFileSync('./init_db/test.txt', 'utf8');
    this.parse(dumpText);
  }

  parsedRates = [];
  parsedEmployees = [];

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

  getEmployeePropertiesInParts = (lines: string[]) => {
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

  createSQLStatements() {
    `CREATE TABLE "employees" (
     "id" SERIAL NOT NULL, 
     "first_name" character varying NOT NULL, 
     "last_name" character varying NOT NULL, 
     "department_id" integer, 
     PRIMARY KEY ("id"))`;

    `CREATE TABLE "departments" (
     "id" SERIAL NOT NULL, 
     "name" character varying NOT NULL, 
     PRIMARY KEY ("id"))`;

    `CREATE TABLE "statements" (
    "id" SERIAL NOT NULL, 
    "date" character varying NOT NULL, 
    "amount" numeric NOT NULL, "employee_id" integer, 
    PRIMARY KEY ("id"))`;

    `CREATE TABLE "donations" (
    "id" SERIAL NOT NULL, 
    "date" character varying NOT NULL, 
    "amount" numeric NOT NULL, 
    "currency" character varying NOT NULL, 
    "amount_in_usd" numeric, "employee_id" integer, 
    PRIMARY KEY ("id"))`;



    let sqlStatements = [];



    //const pathToDumpSQL = path.join(__dirname, './init_db/dump.sql')
    const pathToDumpSQL = './init_db/dump.sql';
    fs.writeFile(pathToDumpSQL, sqlStatements.join('\n'), (err) => {
      if (err) {
        console.error('Error writing output file:', err);
        return;
      }
      console.log('SQL dump file created successfully.');
    });
  }
}
