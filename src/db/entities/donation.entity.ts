import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { Employee } from './employee.entity';

@Entity('donations')
export class Donation {
  @PrimaryColumn()
  id: number;

  @Column()
  created_at: Date;

  @Column('decimal')
  amount: number;

  @Column()
  currency: string;

  @Column('decimal')
  amount_in_usd: number;

  @ManyToOne(() => Employee, (employee: Employee) => employee.donations)
  @JoinColumn({ name: 'employee_id', referencedColumnName: 'id' })
  employee: Employee;

  constructor(
    id: number,
    createdAt: Date,
    amount: number,
    currency: string,
    amount_in_usd: number,
    employee: Employee,
  ) {
    this.id = id;
    this.created_at = createdAt;
    this.amount = amount;
    this.currency = currency;
    this.amount_in_usd = amount_in_usd;
    this.employee = employee;
  }
}
