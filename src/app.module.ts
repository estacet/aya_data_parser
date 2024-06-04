import { Module } from '@nestjs/common';
import { ObjParseService } from './data-parser/obj-parse.service';

@Module({
  imports: [],
  controllers: [],
  providers: [ObjParseService],
})
export class AppModule {}
