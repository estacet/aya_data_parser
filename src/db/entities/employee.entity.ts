import {
  Entity,
  Column,
  ManyToOne,
  OneToMany,
  JoinColumn,
  PrimaryColumn,
} from 'typeorm';
import { Department } from './department.entity';
import { Statement } from './statement.entity';
import { Donation } from './donation.entity';

@Entity('employees')
export class Employee {
  @PrimaryColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  surname: string;

  @ManyToOne(() => Department, (department) => department.employees)
  @JoinColumn({ name: 'department_id' })
  department: Department;

  @OneToMany(() => Statement, (statement) => statement.employee)
  statements: Statement[];

  @OneToMany(() => Donation, (donation) => donation.employee)
  donations: Donation[];

  constructor(
    id: number,
    name: string,
    surname: string,
    department: Department,
    statements: Statement[],
    donations: Donation[],
  ) {
    this.id = id;
    this.name = name;
    this.surname = surname;
    this.department = department;
    this.statements = statements;
    this.donations = donations;
  }
}
