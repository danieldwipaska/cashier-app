import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  DefaultValuePipe,
  ParseIntPipe,
  Request,
  UseGuards,
  ParseBoolPipe,
} from '@nestjs/common';
import { ReportsService } from './reports.service';
import { Prisma } from '@prisma/client';
import { CreateReportDto } from './dto/create-report.dto';
import { AuthGuard } from 'src/auth/auth.guard';
import { UpdateReportDto } from './dto/update-report.dto';
import { ReportStatus, ReportType } from 'src/enums/report';

@Controller('reports')
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @UseGuards(AuthGuard)
  @Post()
  create(@Body() data: CreateReportDto, @Request() req) {
    return this.reportsService.create(data, req.user.username);
  }

  @Get()
  findAll(
    @Query('from') from: string,
    @Query('to') to: string,
    @Query('status') status: ReportStatus,
    @Query('customer_name') customer_name: string,
    @Query('customer_id') customer_id: string,
    @Query('served_by') served_by: string,
    @Query('type') type: ReportType | ReportType[],
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('pagination', new DefaultValuePipe(true), ParseBoolPipe)
    pagination: boolean,
  ) {
    return this.reportsService.findAll(
      from,
      to,
      {
        status,
        customer_name,
        customer_id,
        served_by,
        type,
      },
      page,
      pagination,
    );
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

  @UseGuards(AuthGuard)
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() data: UpdateReportDto,
    @Request() req,
  ) {
    return this.reportsService.update(id, data, req.user.username);
  }

  @Patch(':id/refund')
  refundPartially(
    @Param('id') id: string,
    @Body() data: Prisma.ReportUpdateInput,
  ) {
    return this.reportsService.refundPartially(id, data);
  }

  @Patch(':id/cancel')
  cancelOpenBill(@Param('id') id: string) {
    return this.reportsService.cancelOpenBill(id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.reportsService.remove(id);
  }
}
