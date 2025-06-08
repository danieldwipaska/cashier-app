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
  Req,
  ValidationPipe,
} from '@nestjs/common';
import { ReportsService } from './reports.service';
import { CreateReportDto } from './dto/create-report.dto';
import { AuthGuard, ShopGuard } from 'src/auth/auth.guard';
import {
  UpdateRefundedItemDto,
  UpdateReportDto,
} from './dto/update-report.dto';
import { ReportStatus, ReportType } from 'src/enums/report';

@Controller('reports')
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @UseGuards(AuthGuard, ShopGuard)
  @Post()
  create(
    @Body(new ValidationPipe()) createReportDto: CreateReportDto,
    @Request() req,
  ) {
    return this.reportsService.create(createReportDto, req);
  }

  @UseGuards(AuthGuard, ShopGuard)
  @Get()
  findAll(
    @Req() request: Request,
    @Query('from') from: string,
    @Query('to') to: string,
    @Query('status') status: ReportStatus,
    @Query('customer_name') customer_name: string,
    @Query('customer_id') customer_id: string,
    @Query('crew_id') crew_id: string,
    @Query('type') type: ReportType | ReportType[],
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('pagination', new DefaultValuePipe(true), ParseBoolPipe)
    pagination: boolean,
  ) {
    return this.reportsService.findAll(
      request,
      from,
      to,
      {
        status,
        customer_name,
        customer_id,
        crew_id,
        type,
        shop_id: '',
      },
      page,
      pagination,
    );
  }

  @UseGuards(AuthGuard, ShopGuard)
  @Get(':id')
  findOne(@Req() request: Request, @Param('id') id: string) {
    return this.reportsService.findOne(request, id);
  }

  @UseGuards(AuthGuard, ShopGuard)
  @Get('transactions/:cardNumber')
  findAllByCardNumberAndCustomerId(
    @Req() request: Request,
    @Param('cardNumber') cardNumber: string,
    @Query('customer_id') customer_id: string,
  ) {
    return this.reportsService.findAllByCardNumberAndCustomerId(
      request,
      cardNumber,
      customer_id,
    );
  }

  @UseGuards(AuthGuard, ShopGuard)
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body(new ValidationPipe()) data: UpdateReportDto,
    @Request() req,
  ) {
    return this.reportsService.update(id, data, req);
  }

  @UseGuards(AuthGuard, ShopGuard)
  @Patch(':id/refund')
  refundPartially(
    @Req() request: Request,
    @Param('id') id: string,
    @Body() refundedItems: UpdateRefundedItemDto,
  ) {
    return this.reportsService.refundPartially(request, id, refundedItems);
  }

  @UseGuards(AuthGuard, ShopGuard)
  @Patch(':id/cancel')
  cancelOpenBill(@Req() request: Request, @Param('id') id: string) {
    return this.reportsService.cancelOpenBill(request, id);
  }

  @UseGuards(AuthGuard, ShopGuard)
  @Delete(':id')
  remove(@Req() request: Request, @Param('id') id: string) {
    return this.reportsService.remove(request, id);
  }
}
