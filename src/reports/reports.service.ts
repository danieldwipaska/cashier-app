import { Injectable, NotFoundException } from '@nestjs/common';
import Response from 'src/interfaces/response.interface';
import { Report } from '@prisma/client';
import { PrismaService } from 'src/prisma.service';
import { CrewsService } from 'src/crews/crews.service';
import Randomize from 'src/utils/randomize.util';
import { ReportStatus, ReportType } from 'src/enums/report';
import { orderDiscountedPrice, ServiceTax } from 'src/utils/calculation.util';
import { CreateReportDto } from './dto/create-report.dto';
import {
  UpdateRefundedItemDto,
  UpdateReportDto,
} from './dto/update-report.dto';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class ReportsService {
  constructor(
    private prisma: PrismaService,
    private crewsService: CrewsService,
    private readonly httpService: HttpService,
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
        })),
      },
    };

    try {
      const crew = await this.crewsService.findOne(req, crew_id);
      if (!crew) throw new NotFoundException('Crew Not Found');
    } catch (error) {
      throw error;
    }

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
      return {
        statusCode: 201,
        message: 'CREATED',
        data: report,
      };
    } catch (error) {
      console.log(error);
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
  ): Promise<Response<Report[]>> {
    let take: number | undefined = 15;
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
      console.log(error);
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
      if (!report) throw new NotFoundException('Report Not Found');

      return {
        statusCode: 200,
        message: 'OK',
        data: report,
      };
    } catch (error) {
      console.log(error);
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

        return {
          statusCode: 200,
          message: 'OK',
        };
      } catch (error) {
        console.log(error);
        throw error;
      }
    } catch (error) {
      console.log(error);
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
      console.log(error);
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

      try {
        // Remove old items and add new ones
        await this.prisma.$transaction([
          this.prisma.item.deleteMany({ where: { report_id: id } }),
          this.prisma.item.createMany({
            data: items.map((item) => ({
              report_id: id,
              fnb_id: item.fnb_id,
              amount: item.amount,
              refunded_amount: item.refunded_amount || 0,
              discount_percent: item.discount_percent || 0,
              price: item.price,
            })),
          }),
        ]);

        const report = await this.prisma.report.update({
          where: {
            id,
            shop_id: req.shop.id,
          },
          data: reportData,
          include: { Item: true },
        });
        return {
          statusCode: 200,
          message: 'OK',
          data: report,
        };
      } catch (error) {
        console.log(error);
        throw error;
      }
    } catch (error) {
      console.log(error);
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
        await this.prisma.item.updateMany({
          where: { report_id: id, id: item.id },
          data: {
            refunded_amount: {
              increment: item.added_refunded_amount,
            },
          },
        });
      }

      return { statusCode: 200, message: 'OK' };
    } catch (error) {
      throw error;
    }
  }

  async cancelOpenBill(request: any, id: string): Promise<Response<Report>> {
    try {
      const report = await this.prisma.report.update({
        where: {
          id,
          status: ReportStatus.UNPAID,
          shop_id: request.shop.id,
        },
        data: {
          status: ReportStatus.CANCELLED,
        },
      });

      console.log(report);

      return {
        statusCode: 200,
        message: 'OK',
        data: report,
      };
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async remove(request: any, id: string): Promise<Response<Report>> {
    try {
      const report = await this.prisma.report.findUnique({
        where: {
          id,
          shop_id: request.shop.id,
        },
      });
      if (!report) throw new NotFoundException('Report Not Found');

      try {
        await this.prisma.report.delete({
          where: {
            id,
            shop_id: request.shop.id,
          },
        });

        return {
          statusCode: 200,
          message: 'OK',
          data: report,
        };
      } catch (error) {
        console.log(error);
        throw error;
      }
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
}
