import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('rates')
export class Rate {
  @PrimaryColumn()
  id: number;

  @Column()
  created_at: Date;

  @PrimaryColumn()
  sign: string;

  @Column('decimal')
  value: number;

  constructor(id: number, createdAt: Date, value: number, sign: string) {
    this.id = id;
    this.created_at = createdAt;
    this.value = value;
    this.sign = sign;
  }
}
