import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('rates')
export class Rate {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  createdAt: Date;

  @Column()
  sign: string;

  @Column('decimal')
  value: number;

  constructor(id: number, createdAt: Date, value: number, sign: string) {
    this.id = id;
    this.createdAt = createdAt;
    this.value = value;
    this.sign = sign;
  }
}
