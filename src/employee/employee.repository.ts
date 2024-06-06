import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { AppDataSource } from '../db/data-source';

@Injectable()
export class EmployeeRepository {
  constructor(private dataSource: DataSource) {
    this.dataSource = AppDataSource;
  }
  async calculateRewards() {
    const query = `
      WITH total_donations AS (
        SELECT SUM(amount_in_usd) AS total
      FROM donations
    ),
      eligible_employees AS (
        SELECT employee_id, SUM(amount_in_usd) AS contribution
      FROM donations
      GROUP BY employee_id
      HAVING SUM(amount_in_usd) > 100
    )
      SELECT
      e.employee_id,
        CAST(e.contribution AS NUMERIC(8, 3)) AS contribution,
        -- get correct reward based on percentage of contribution
      CAST((e.contribution / td.total) * 10000 AS NUMERIC(8, 3)) AS reward
      FROM eligible_employees e, total_donations td;
      `;
    const result = await this.dataSource.query(query);
    return result;
  }
}
