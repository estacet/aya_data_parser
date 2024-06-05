import { Module } from '@nestjs/common';
import { ParserService } from './data-parser/parser.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppDataSource } from './db/data-source';

@Module({
  imports: [
    TypeOrmModule.forRoot({ ...AppDataSource.options }),
  ],
  controllers: [],
  providers: [ParserService],
})
export class AppModule {}
