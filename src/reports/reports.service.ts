import { Injectable, NotFoundException } from '@nestjs/common';
import Response from '../interfaces/response.interface';
import { Report } from '@prisma/client';
import { PrismaService } from '../prisma.service';
import { CrewsService } from '../crews/crews.service';
import Randomize from '../utils/randomize.util';
import { ReportStatus, ReportType } from '../enums/report';
import { orderDiscountedPrice, ServiceTax } from '../utils/calculation.util';
import { CreateReportDto } from './dto/create-report.dto';
import {
  UpdateRefundedItemDto,
  UpdateReportDto,
} from './dto/update-report.dto';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { CustomLoggerService } from '../loggers/custom-logger.service';

@Injectable()
export class ReportsService {
  constructor(
    private prisma: PrismaService,
    private crewsService: CrewsService,
    private readonly httpService: HttpService,
    private readonly logger: CustomLoggerService,
  ) {}

  async create(
    createReportDto: CreateReportDto,
    req: any,
  ): Promise<Response<Report>> {
    const { type, status, customer_name, method_id, crew_id, note, items } =
      createReportDto;

    const newReportData: any = {
      report_id: Randomize.generateReportId('PAY', 6),
      type,
      status: status || ReportStatus.PAID,
      customer_name,
      crew_id,
      method_id,
      note: note || '',
      total_payment: 0,
      shop_id: req.shop.id,
      included_tax_service: false,
      total_payment_after_tax_service: 0,
      tax_percent: 0,
      service_percent: 0,
      total_tax: 0,
      Item: {
        create: items.map((item) => ({
          fnb_id: item.fnb_id,
          amount: item.amount,
          refunded_amount: item.refunded_amount || 0,
          discount_percent: item.discount_percent || 0,
          price: item.price,
          note: item.note,
          ModifierItem: {
            create: item.modifierItems.map((modifierItem) => ({
              modifier_id: modifierItem.modifier_id,
            })),
          },
        })),
      },
    };

    const crew = await this.crewsService.findOne(req, crew_id);
    if (!crew) throw new NotFoundException('Crew Not Found');

    // CALCULATE TOTAL PAYMENT
    let totalPayment = 0;
    items.forEach((item) => {
      totalPayment += orderDiscountedPrice({
        price: item.price,
        amount: item.amount,
        discountPercent: item.discount_percent || 0,
      });
    });
    newReportData.total_payment = totalPayment;

    // CALCULATE TAX AND SERVICE
    const shop = await this.prisma.shop.findUnique({
      where: { id: req.shop.id },
    });
    if (!shop) throw new NotFoundException('Shop Not Found');

    newReportData.included_tax_service = shop.included_tax_service;

    const taxService = new ServiceTax(totalPayment, shop.service, shop.tax);

    if (!shop.included_tax_service) {
      newReportData.total_payment_after_tax_service = taxService.calculateTax();
    } else {
      newReportData.total_payment_after_tax_service = taxService.totalPayment;
    }

    newReportData.tax_percent = taxService.taxPercent;
    newReportData.service_percent = taxService.servicePercent;
    newReportData.total_tax = taxService.getTax();

    try {
      const report = await this.prisma.report.create({
        data: newReportData,
        include: { Item: true },
      });

      this.logger.logBusinessEvent(
        `New report created: ${report.report_id}`,
        'REPORT_CREATED',
        'REPORT',
        report.id,
        req.user?.username,
        null,
        report,
        createReportDto,
      );
      return {
        statusCode: 201,
        message: 'CREATED',
        data: report,
      };
    } catch (error) {
      this.logger.logError(
        error,
        'ReportsService.create',
        req.user?.username,
        req.requestId,
        createReportDto,
      );
      throw error;
    }
  }

  async findAll(
    request: any,
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
    page?: number,
    pagination?: boolean,
    per_page?: number,
  ): Promise<Response<Report[]>> {
    let take: number | undefined = per_page || 15;
    let skip: number | undefined = page ? (page - 1) * take : 0;

    if (pagination === false) {
      take = undefined;
      skip = undefined;
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
      // eslint-disable-next-line prefer-const
      let [reports, totalReports] = await Promise.all([
        this.prisma.report.findMany({
          orderBy: { updated_at: 'desc' },
          where: filter,
          take,
          skip: skip || 0,
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
        }),
        this.prisma.report.count({
          where: filter,
        }),
      ]);

      if (!reports.length)
        return {
          statusCode: 200,
          message: 'OK',
          data: [],
        };

      if (from && to) {
        const timeInterval: { from: Date; to: Date } = {
          from: new Date(from),
          to: new Date(to),
        };

        reports = reports.filter(
          (report: Report) =>
            report.created_at >= timeInterval.from &&
            report.created_at <= timeInterval.to,
        );
      }

      const totalPage = Math.ceil(totalReports / take);
      const currentPage = page || 1;
      const nextPage = currentPage < totalPage ? currentPage + 1 : null;
      const prevPage = currentPage > 1 ? currentPage - 1 : null;
      const hasNextPage = currentPage < totalPage;
      const hasPrevPage = currentPage > 1;

      return {
        statusCode: 200,
        message: 'OK',
        data: reports,
        pageMetaData: {
          currentPage,
          perPage: take,
          totalItems: totalReports,
          totalPages: totalPage,
          nextPage,
          prevPage,
          hasNextPage,
          hasPrevPage,
        },
      };
    } catch (error) {
      this.logger.logError(
        error,
        'ReportsService.findAll',
        request.user?.username,
        request.requestId,
        {
          from,
          to,
          filter,
          page,
          pagination,
        },
      );
      throw error;
    }
  }

  async findOne(request: any, id: string): Promise<Response<Report>> {
    try {
      const report = await this.prisma.report.findUnique({
        where: {
          id,
          shop_id: request.shop.id,
        },
        include: {
          Item: {
            include: {
              fnb: true,
              ModifierItem: {
                include: {
                  modifier: true,
                },
              },
            },
          },
          crew: true,
          method: true,
        },
      });
      if (!report) throw new NotFoundException('Report Not Found');

      return {
        statusCode: 200,
        message: 'OK',
        data: report,
      };
    } catch (error) {
      this.logger.logError(
        error,
        'ReportsService.findOne',
        request.user?.username,
        request.requestId,
        { id, shop_id: request.shop.id },
      );
      throw error;
    }
  }

  async printReceipt(
    request: any,
    id: string,
    is_checker: boolean,
  ): Promise<Response<any>> {
    try {
      const report = await this.prisma.report.findUnique({
        where: {
          id,
          shop_id: request.shop.id,
        },
        include: {
          Item: {
            include: {
              fnb: {
                select: {
                  name: true,
                },
              },
            },
          },
          crew: true,
          method: true,
        },
      });
      if (!report) throw new NotFoundException('Receipt not found');

      const receiptData = {
        receiptType: report.type,
        storeName: 'Bahari Irish Pub',
        address: 'Jl. Kawi No.8A, Kota Malang, 65119',
        date: report.created_at,
        receiptNumber: report.report_id,
        servedBy: report.crew.name,
        customerName: report.customer_name,
        items: report.Item.map((item) => {
          return {
            name: item.fnb.name,
            quantity: item.amount,
            price: item.price,
            discountPercent: item.discount_percent,
            discountedPrice: orderDiscountedPrice({
              price: item.price,
              amount: item.amount,
              discountPercent: item.discount_percent,
            }),
          };
        }),
        includedTaxService: report.included_tax_service,
        taxPercent: report.tax_percent,
        servicePercent: report.service_percent,
        subtotal: report.total_payment,
        total: report.total_payment_after_tax_service,
      };

      try {
        const url = `${process.env.BAHARI_RECEIPT_PRINTING_BASE_URL}/print`;
        await firstValueFrom(
          this.httpService.post(url, {
            data: receiptData,
            isChecker: is_checker,
          }),
        );

        this.logger.logBusinessEvent(
          `Receipt printed: ${receiptData.receiptNumber}`,
          'RECEIPT_PRINT',
          'RECEIPT',
          receiptData.receiptNumber,
          request.user?.username,
          null,
          null,
          {
            id,
            shop_id: request.shop.id,
            is_checker,
          },
        );

        return {
          statusCode: 200,
          message: 'OK',
        };
      } catch (error) {
        this.logger.logError(
          error,
          'ReportsService.printReceipt',
          request.user?.username,
          request.requestId,
          {
            id,
            shop_id: request.shop.id,
            is_checker,
          },
        );
        throw error;
      }
    } catch (error) {
      this.logger.logError(
        error,
        'ReportsService.printReceipt',
        request.user?.username,
        request.requestId,
        {
          id,
          shop_id: request.shop.id,
          is_checker,
        },
      );
      throw error;
    }
  }

  async findAllByCardNumberAndCustomerId(
    request: any,
    cardNumber: string,
    customerId: string,
  ): Promise<Response<Report[]>> {
    try {
      const reports = await this.prisma.report.findMany({
        where: {
          shop_id: request.shop.id,
          AND: [{ card_number: cardNumber }, { customer_id: customerId }],
        },
        orderBy: { created_at: 'desc' },
      });

      return {
        statusCode: 200,
        message: 'OK',
        data: reports,
      };
    } catch (error) {
      this.logger.logError(
        error,
        'ReportsService.findAllByCardNumberAndCustomerId',
        request.user?.username,
        request.requestId,
        {
          cardNumber,
          customerId,
          shop_id: request.shop.id,
        },
      );
      throw error;
    }
  }

  async update(
    id: string,
    updateReportDto: UpdateReportDto,
    req: any,
  ): Promise<Response<Report>> {
    const { status, customer_name, method_id, crew_id, note, items } =
      updateReportDto;

    const reportData: any = {
      status: status || ReportStatus.PAID,
      customer_name,
      crew_id,
      method_id,
      note: note || '',
      total_payment: 0,
    };

    // CALCULATE TOTAL PAYMENT
    let totalPayment = 0;
    items.forEach((item) => {
      totalPayment += orderDiscountedPrice({
        price: item.price,
        amount: item.amount,
        discountPercent: item.discount_percent || 0,
      });
    });
    reportData.total_payment = totalPayment;

    try {
      // CALCULATE TAX AND SERVICE
      const shop = await this.prisma.shop.findUnique({
        where: { id: req.shop.id },
      });
      if (!shop) throw new NotFoundException('Shop Not Found');

      reportData.included_tax_service = shop.included_tax_service;

      const taxService = new ServiceTax(totalPayment, shop.service, shop.tax);

      if (!shop.included_tax_service) {
        reportData.total_payment_after_tax_service = taxService.calculateTax();
      } else {
        reportData.total_payment_after_tax_service = taxService.totalPayment;
      }

      reportData.tax_percent = taxService.taxPercent;
      reportData.service_percent = taxService.servicePercent;
      reportData.total_tax = taxService.getTax();

      const oldItems = await this.prisma.item.findMany({
        where: {
          report_id: id,
          report: {
            shop_id: req.shop.id,
          },
        },
      });

      const report = await this.prisma.report.findUnique({
        where: {
          id,
          shop_id: req.shop.id,
        },
        include: { Item: true },
      });
      if (!report) throw new NotFoundException('Report Not Found');

      try {
        // Remove old items and add new ones
        const updatedReport = await this.prisma.$transaction(async (prisma) => {
          // Delete old items first
          await prisma.item.deleteMany({ where: { report_id: id } });

          // Create each item one by one to allow nested create
          for (const item of items) {
            await prisma.item.create({
              data: {
                report_id: id,
                fnb_id: item.fnb_id,
                amount: item.amount,
                refunded_amount: item.refunded_amount || 0,
                discount_percent: item.discount_percent || 0,
                price: item.price,
                note: item.note,
                ModifierItem: {
                  create: item.modifierItems.map((modifierItem) => ({
                    modifier_id: modifierItem.modifier_id,
                  })),
                },
              },
            });
          }

          // Update report
          const updatedReport = await prisma.report.update({
            where: {
              id,
              shop_id: req.shop.id,
            },
            data: reportData,
            include: { Item: true },
          });

          return updatedReport;
        });

        this.logger.logBusinessEvent(
          `Items deleted: ${oldItems.map((item) => item.id).join(', ')}`,
          'ITEM_DELETED',
          'ITEM',
          oldItems.map((item) => item.id).join(', '),
          req.user?.username,
          oldItems,
          null,
          {
            id,
            shop_id: req.shop.id,
            updateReportDto,
          },
        );

        this.logger.logBusinessEvent(
          `New items created from fnbs: ${items.map((item) => item.fnb_id).join(', ')}`,
          'ITEM_CREATED',
          'ITEM',
          items.map((item) => item.fnb_id).join(', '),
          req.user?.username,
          null,
          items,
          {
            id,
            shop_id: req.shop.id,
            updateReportDto,
          },
        );

        this.logger.logBusinessEvent(
          `Report updated: ${updatedReport.report_id}`,
          'REPORT_UPDATED',
          'REPORT',
          updatedReport.id,
          req.user?.username,
          report,
          updatedReport,
          {
            id,
            shop_id: req.shop.id,
            updateReportDto,
          },
        );

        return {
          statusCode: 200,
          message: 'OK',
          data: updatedReport,
        };
      } catch (error) {
        this.logger.logError(
          error,
          'ReportsService.update',
          req.user?.username,
          req.requestId,
          {
            id,
            shop_id: req.shop.id,
            updateReportDto,
          },
        );
        throw error;
      }
    } catch (error) {
      this.logger.logError(
        error,
        'ReportsService.update',
        req.user?.username,
        req.requestId,
        {
          id,
          shop_id: req.shop.id,
          updateReportDto,
        },
      );
      throw error;
    }
  }

  async refundPartially(
    request: any,
    id: string,
    updateRefundedItemDto: UpdateRefundedItemDto,
  ): Promise<Response<Report>> {
    const { items } = updateRefundedItemDto;
    try {
      const report = await this.prisma.report.findUnique({
        where: {
          id,
          shop_id: request.shop.id,
        },
        include: { Item: true },
      });
      if (!report) throw new NotFoundException('Report Not Found');

      // Update refunded_amount for each item
      for (const item of items) {
        const oldItem = await this.prisma.item.findUnique({
          where: { report_id: id, id: item.id },
        });
        if (!oldItem) {
          throw new NotFoundException(`Item with id ${item.id} not found`);
        }

        const updatedItem = await this.prisma.item.update({
          where: { report_id: id, id: item.id },
          data: {
            refunded_amount: {
              increment: item.added_refunded_amount,
            },
          },
        });

        this.logger.logBusinessEvent(
          `Item updated: report number ${report.report_id}, item id ${item.id}`,
          'ITEM_UPDATED',
          'ITEM',
          item.id,
          request.user?.username,
          oldItem,
          updatedItem,
          {
            id,
            shop_id: request.shop.id,
            updateRefundedItemDto,
          },
        );
      }

      return { statusCode: 200, message: 'OK' };
    } catch (error) {
      this.logger.logError(
        error,
        'ReportsService.refundPartially',
        request.user?.username,
        request.requestId,
        {
          id,
          shop_id: request.shop.id,
          updateRefundedItemDto,
        },
      );
      throw error;
    }
  }

  async cancelOpenBill(request: any, id: string): Promise<Response<Report>> {
    try {
      const report = await this.prisma.report.findUnique({
        where: {
          id,
          status: ReportStatus.UNPAID,
          shop_id: request.shop.id,
        },
      });
      if (!report)
        throw new NotFoundException('Report Not Found or Already Paid');

      const updatedReport = await this.prisma.report.update({
        where: {
          id,
          status: ReportStatus.UNPAID,
          shop_id: request.shop.id,
        },
        data: {
          status: ReportStatus.CANCELLED,
        },
      });

      this.logger.logBusinessEvent(
        `Open bill cancelled: ${updatedReport.report_id}`,
        'REPORT_CANCELLED',
        'REPORT',
        updatedReport.id,
        request.user?.username,
        report,
        updatedReport,
        { id, shop_id: request.shop.id },
      );

      return {
        statusCode: 200,
        message: 'OK',
        data: report,
      };
    } catch (error) {
      this.logger.logError(
        error,
        'ReportsService.cancelOpenBill',
        request.user?.username,
        request.requestId,
        { id, shop_id: request.shop.id },
      );
      throw error;
    }
  }

  async remove(request: any, id: string): Promise<Response<Report>> {
    try {
      const deletedReport = await this.prisma.report.delete({
        where: {
          id,
          shop_id: request.shop.id,
        },
      });

      if (!deletedReport) throw new NotFoundException('Report Not Found');

      this.logger.logBusinessEvent(
        `Report deleted: ${deletedReport.report_id}`,
        'REPORT_DELETED',
        'REPORT',
        deletedReport.id,
        request.user?.username,
        deletedReport,
        null,
        { id, shop_id: request.shop.id },
      );

      return {
        statusCode: 200,
        message: 'OK',
        data: deletedReport,
      };
    } catch (error) {
      this.logger.logError(
        error,
        'ReportsService.remove',
        request.user?.username,
        request.requestId,
        { id, shop_id: request.shop.id },
      );
      throw error;
    }
  }
}
