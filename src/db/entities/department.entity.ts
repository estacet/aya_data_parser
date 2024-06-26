import { Entity, Column, OneToMany, PrimaryColumn } from 'typeorm';
import { Employee } from './employee.entity';

@Entity('departments')
export class Department {
  @PrimaryColumn()
  id: number;

  @Column()
  name: string;

  @OneToMany(() => Employee, (employee) => employee.department)
  employees: Employee[];

  constructor(id: number, name: string) {
    this.id = id;
    this.name = name;
  }
}
