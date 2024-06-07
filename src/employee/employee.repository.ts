import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { AppDataSource } from '../db/data-source';
import { RewardedEmployeeDto } from './dto';

@Injectable()
export class EmployeeRepository {
  constructor(private dataSource: DataSource = AppDataSource) {}
  async calculateRewards(): Promise<RewardedEmployeeDto[]> {
    const query = `
            WITH donations_sum AS (
          SELECT SUM(amount_in_usd) AS total
          FROM donations
      ),
      employee_to_be_rewarded AS (
          SELECT id, SUM(amount_in_usd) AS donation
          FROM donations
          GROUP BY id
          HAVING SUM(amount_in_usd) > 100
      )
      SELECT 
        e.id, 
        (e.donation / ds.total) * 10000 AS reward
      FROM employee_to_be_rewarded e, donations_sum ds;
      `;

    return await this.dataSource.query(query);
  }
}
