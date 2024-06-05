import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Employee } from './employee.entity';

@Entity('statements')
export class Statement {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  created_at: Date;

  @Column('decimal')
  amount: number;

  @ManyToOne(() => Employee, (employee: Employee) => employee.statements)
  @JoinColumn({ name: 'employee_id', referencedColumnName: 'id' })
  employee: Employee;
}
