import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { Employee } from './employee.entity';

@Entity('statements')
export class Statement {
  @PrimaryColumn()
  id: number;

  @Column()
  created_at: Date;

  @Column('decimal')
  amount: number;

  @ManyToOne(() => Employee, (employee: Employee) => employee.statements)
  @JoinColumn({ name: 'employee_id', referencedColumnName: 'id' })
  employee: Employee;

  constructor(id: number, createdAt: Date, amount: number, employee: Employee) {
    this.id = id;
    this.created_at = createdAt;
    this.amount = amount;
    this.employee = employee;
  }
}
