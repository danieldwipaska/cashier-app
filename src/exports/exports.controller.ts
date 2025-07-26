import {
  Controller,
  Get,
  Header,
  Query,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { ExportsService } from './exports.service';
import { ReportStatus, ReportType } from 'src/enums/report';
import { AuthGuard, ShopGuard } from 'src/auth/auth.guard';

@Controller('exports')
export class ExportsController {
  constructor(private readonly exportsService: ExportsService) {}

  @UseGuards(AuthGuard, ShopGuard)
  @Get('reports')
  @Header('Content-Type', 'text/csv') // Menentukan tipe konten sebagai CSV
  @Header('Content-Disposition', 'attachment; filename="users.csv"') // Memberi tahu browser untuk mengunduh file
  reports(
    @Req() request: Request,
    @Res() response: Response,
    @Query('from') from: string,
    @Query('to') to: string,
    @Query('status') status: ReportStatus,
    @Query('customer_name') customer_name: string,
    @Query('customer_id') customer_id: string,
    @Query('crew_id') crew_id: string,
    @Query('type') type: ReportType | ReportType[],
  ) {
    return this.exportsService.reports(request, response, from, to, {
      status,
      customer_name,
      customer_id,
      crew_id,
      type,
      shop_id: '',
    });
  }
}
