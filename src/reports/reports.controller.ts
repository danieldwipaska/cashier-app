import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  NotFoundException,
} from '@nestjs/common';
import { ReportsService } from './reports.service';
import { Prisma } from '@prisma/client';

@Controller('reports')
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Post()
  create(@Body() data: Prisma.ReportCreateInput) {
    return this.reportsService.create(data);
  }

  @Get()
  findAll(
    @Query('from') from: string,
    @Query('to') to: string,
    @Query('status') status: string,
  ) {
    return this.reportsService.findAll(from, to, { status });
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.reportsService.findOne(id);
  }

  @Get('transactions/:cardNumber')
  findAllByCardNumberAndCustomerId(
    @Param('cardNumber') cardNumber: string,
    @Query('customer_id') customer_id: string,
  ) {
    return this.reportsService.findAllByCardNumberAndCustomerId(
      cardNumber,
      customer_id,
    );
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() data: Prisma.ReportCreateInput) {
    return this.reportsService.update(id, data);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.reportsService.remove(id);
  }
}
