import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { Department } from './department.entity';
import { Statement } from './statement.entity';
import { Donation } from './donation.entity';

@Entity('employees')
export class Employee {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  first_name: string;

  @Column()
  last_name: string;

  @ManyToOne(() => Department, (department) => department.employees)
  @JoinColumn({ name: 'id' })
  department: Department;

  @OneToMany(() => Statement, (statement) => statement.employee)
  statements: Statement[];

  @OneToMany(() => Donation, (donation) => donation.employee)
  donations: Donation[];

  constructor(
    id: number,
    first_name: string,
    last_name: string,
    department: Department,
    statements: Statement[],
    donations: Donation[],
  ) {
    this.id = id;
    this.first_name = first_name;
    this.last_name = last_name;
    this.department = department;
    this.statements = statements;
    this.donations = donations;
  }
}
