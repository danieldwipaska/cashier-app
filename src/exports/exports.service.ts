import { Injectable } from '@nestjs/common';
import { Parser } from 'json2csv';
import { ReportStatus, ReportType } from 'src/enums/report';
import { CustomLoggerService } from 'src/loggers/custom-logger.service';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class ExportsService {
  constructor(
    private prisma: PrismaService,
    private readonly logger: CustomLoggerService,
  ) {}

  async reports(
    request: any,
    response: any,
    from?: string,
    to?: string,
    filter?: {
      status?: ReportStatus;
      customer_name?: string;
      customer_id?: string;
      crew_id?: string;
      type?: ReportType | any;
      shop_id?: string;
    },
  ) {
    const fields = [
      { label: 'report_id', value: 'report_id' },
      { label: 'type', value: 'type' },
      { label: 'status', value: 'status' },
      { label: 'customer_name', value: 'customer_name' },
      { label: 'customer_id', value: 'customer_id' },
      { label: 'card_number', value: 'card_number' },
      { label: 'initial_balance', value: 'initial_balance' },
      { label: 'final_balance', value: 'final_balance' },
      { label: 'total_payment', value: 'total_payment' },
      { label: 'included_tax_service', value: 'included_tax_service' },
      {
        label: 'total_payment_after_tax_service',
        value: 'total_payment_after_tax_service',
      },
      { label: 'tax_percent', value: 'tax_percent' },
      { label: 'service_percent', value: 'service_percent' },
      { label: 'total_tax', value: 'total_tax' },
      { label: 'note', value: 'note' },
      { label: 'payment_method', value: 'payment_method' },
      { label: 'served_by', value: 'served_by' },
      { label: 'item_names', value: 'item_names' },
      { label: 'item_amount', value: 'item_amount' },
      { label: 'item_prices', value: 'item_prices' },
      { label: 'created_at', value: 'created_at' },
      { label: 'updated_at', value: 'updated_at' },
    ];
    if (!filter.type) {
      filter.type = undefined;
    }

    if (!filter.status) {
      filter.status = undefined;
    }

    // Type can have more than one value
    if (typeof filter.type === 'object') {
      filter.type = {
        in: filter.type,
      };
    }

    if (filter) {
      filter.shop_id = request.shop.id;
    }

    try {
      const json2csvParser = new Parser({ fields });

      const reports = await this.prisma.report.findMany({
        orderBy: { updated_at: 'desc' },
        where: {
          ...filter,
          created_at: {
            gte: from ? new Date(from) : undefined,
            lte: to ? new Date(to) : undefined,
          },
        },
        include: {
          Item: {
            include: {
              fnb: {
                include: {
                  category: true,
                },
              },
            },
          },
          crew: true,
          method: true,
        },
      });

      const reportCSV = reports.map((report) => {
        return {
          report_id: report.report_id,
          type: report.type,
          status: report.status,
          customer_name: report.customer_name,
          customer_id: report.customer_id,
          card_number: report.card_number,
          initial_balance: report.initial_balance,
          final_balance: report.final_balance,
          total_payment: report.total_payment,
          included_tax_service: report.included_tax_service,
          total_payment_after_tax_service:
            report.total_payment_after_tax_service,
          tax_percent: report.tax_percent,
          service_percent: report.service_percent,
          total_tax: report.total_tax,
          note: report.note,
          payment_method: report.method?.name || '',
          served_by: report.crew?.name || '',
          item_names: report.Item.map((item) => item.fnb.name).join(';'),
          item_amount: report.Item.map((item) => item.amount).join(';'),
          item_prices: report.Item.map((item) => item.price).join(';'),
          created_at: report.created_at.toISOString(),
          updated_at: report.updated_at.toISOString(),
        };
      });

      const csv = json2csvParser.parse(reportCSV);

      return response.send(csv);
    } catch (error) {
      this.logger.logError(
        error,
        'ExportsService.reports',
        request.user?.username,
        request.requestId,
        {
          from,
          to,
          filter,
        },
      );
      throw error;
    }
  }
}
