import { Injectable, NotFoundException } from '@nestjs/common';
import Response from 'src/interfaces/response.interface';
import { Report } from '@prisma/client';
import { PrismaService } from 'src/prisma.service';
import { CrewsService } from 'src/crews/crews.service';
import Randomize from 'src/utils/randomize.util';
import { ReportStatus, ReportType } from 'src/enums/report';
import { orderDiscountedPrice, ServiceTax } from 'src/utils/calculation.util';
import { CreateReportDto } from './dto/create-report.dto';
import { UpdateReportDto } from './dto/update-report.dto';

@Injectable()
export class ReportsService {
  constructor(
    private prisma: PrismaService,
    private crewsService: CrewsService,
  ) {}

  async create(
    createReportDto: CreateReportDto,
    req: any,
  ): Promise<Response<Report>> {
    const {
      type,
      status,
      customer_name,
      payment_method,
      order_id,
      order_amount,
      crew_id,
      note,
    } = createReportDto;

    const newReportData: any = {
      report_id: Randomize.generateReportId('PAY', 6),
      type,
      status: status || ReportStatus.PAID,
      customer_name,
      crew_id,
      payment_method,
      order_id,
      order_amount,
      note: note || '',
      total_payment: 0,
      served_by: '',
      shop_id: req.shop.id,
    };

    try {
      const crew = await this.crewsService.findOne(req, crew_id);
      if (!crew) throw new NotFoundException('Crew Not Found');

      newReportData.served_by = crew.data.name;
      newReportData.collected_by = crew.data.name;
    } catch (error) {
      throw error;
    }

    // FOOD AND BEVERAGE DATA
    const orderName: string[] = [];
    const orderCategory: string[] = [];
    const orderPrice: number[] = [];
    const orderDiscountStatus: boolean[] = [];
    const orderDiscountPercent: number[] = [];
    const refundedOrderAmount: number[] = Array(order_id.length).fill(0);

    try {
      for (const id of order_id) {
        const fnb = await this.prisma.fnbs.findUnique({
          where: { id },
          include: { category: true },
        });
        if (!fnb) throw new NotFoundException('Food And Beverage Not Found');

        orderName.push(fnb.name);
        orderPrice.push(fnb.price);
        orderCategory.push(fnb.category.name);
        orderDiscountPercent.push(fnb.discount_percent);
        orderDiscountStatus.push(fnb.discount_status);
      }
    } catch (error) {
      console.log(error);
      throw error;
    }

    newReportData.order_name = orderName;
    newReportData.order_price = orderPrice;
    newReportData.order_category = orderCategory;
    newReportData.order_discount_status = orderDiscountStatus;
    newReportData.order_discount_percent = orderDiscountPercent;
    newReportData.refunded_order_amount = refundedOrderAmount;

    // CALCULATE TOTAL PAYMENT
    let totalPayment = 0;
    order_amount.forEach((amount: number, index: number) => {
      totalPayment += orderDiscountedPrice({
        price: orderPrice[index],
        amount,
        discountPercent: orderDiscountPercent[index],
      });
    });

    newReportData.total_payment = totalPayment;

    // CALCULATE TAX AND SERVICE
    const shop = await this.prisma.shop.findUnique({
      where: {
        id: req.shop.id,
      },
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
    from: string,
    to: string,
    filter: {
      status: ReportStatus;
      customer_name: string;
      customer_id: string;
      served_by: string;
      type: ReportType | any;
      shop_id: string;
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

    filter.shop_id = request.shop.id;

    try {
      // eslint-disable-next-line prefer-const
      let [reports, totalReports] = await Promise.all([
        this.prisma.report.findMany({
          orderBy: { updated_at: 'desc' },
          where: filter,
          take,
          skip: skip || 0,
        }),
        this.prisma.report.count({
          where: filter,
        }),
      ]);

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
    const {
      status,
      customer_name,
      payment_method,
      order_id,
      order_amount,
      crew_id,
      note,
    } = updateReportDto;

    const reportData: any = {
      status: status || ReportStatus.PAID,
      customer_name,
      crew_id,
      payment_method,
      order_id,
      order_amount,
      note: note || '',
      total_payment: 0,
      served_by: '',
    };

    try {
      const crew = await this.crewsService.findOne(req, crew_id);
      if (!crew) throw new NotFoundException('Crew Not Found');

      reportData.served_by = crew.data.name;
      reportData.collected_by = crew.data.name;
    } catch (error) {
      throw error;
    }

    // FOOD AND BEVERAGE DATA
    const orderName: string[] = [];
    const orderCategory: string[] = [];
    const orderPrice: number[] = [];
    const orderDiscountStatus: boolean[] = [];
    const orderDiscountPercent: number[] = [];
    const refundedOrderAmount: number[] = Array(order_id.length).fill(0);

    try {
      for (const id of order_id) {
        const fnb = await this.prisma.fnbs.findUnique({
          where: {
            id,
            shop_id: req.shop.id,
          },
          include: { category: true },
        });
        if (!fnb) throw new NotFoundException('Food And Beverage Not Found');

        orderName.push(fnb.name);
        orderPrice.push(fnb.price);
        orderCategory.push(fnb.category.name);
        orderDiscountPercent.push(fnb.discount_percent);
        orderDiscountStatus.push(fnb.discount_status);
      }
    } catch (error) {
      console.log(error);
      throw error;
    }

    reportData.order_name = orderName;
    reportData.order_price = orderPrice;
    reportData.order_category = orderCategory;
    reportData.order_discount_status = orderDiscountStatus;
    reportData.order_discount_percent = orderDiscountPercent;
    reportData.refunded_order_amount = refundedOrderAmount;

    // CALCULATE TOTAL PAYMENT
    let totalPayment = 0;
    order_amount.forEach((amount: number, index: number) => {
      totalPayment += orderDiscountedPrice({
        price: orderPrice[index],
        amount,
        discountPercent: orderDiscountPercent[index],
      });
    });

    reportData.total_payment = totalPayment;

    // CALCULATE TAX AND SERVICE
    const shop = await this.prisma.shop.findUnique({
      where: {
        id: req.shop.id,
      },
    });
    if (!shop) throw new NotFoundException('User Not Found');

    reportData.included_tax_service = shop.included_tax_service;

    const taxService = new ServiceTax(totalPayment, shop.service, shop.tax);

    if (!shop.included_tax_service) {
      reportData.total_payment_after_tax_service = taxService.calculateTax();
    } else {
      reportData.total_payment_after_tax_service = taxService.totalPayment;
    }

    reportData.tax_percent = taxService.taxPercent;
    reportData.service_percent = taxService.servicePercent;
    reportData.total_tax = taxService.getTax(); // not yet handled

    try {
      const report = await this.prisma.report.update({
        where: {
          id,
          shop_id: req.shop.id,
        },
        data: reportData,
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
  }

  async refundPartially(
    request: any,
    id: string,
    data: any,
  ): Promise<Response<Report>> {
    try {
      const report = await this.prisma.report.findUnique({
        where: {
          id,
          shop_id: request.shop.id,
        },
      });
      if (!report) throw new NotFoundException('Report Not Found');

      // Refund Data
      let total_payment = 0;

      data.refunded_order_amount.forEach((amount: number, index: number) => {
        if (report.order_discount_status[index]) {
          total_payment += orderDiscountedPrice({
            price: report.order_price[index],
            amount,
            discountPercent: report.order_discount_percent[index],
          });
        } else {
          total_payment += amount * report.order_price[index];
        }
      });

      let total_payment_after_tax_service = 0;

      const taxService = new ServiceTax(
        total_payment,
        report.service_percent,
        report.tax_percent,
      );

      if (!report.included_tax_service) {
        total_payment_after_tax_service = taxService.calculateTax();
      } else {
        total_payment_after_tax_service = taxService.totalPayment;
      }

      const total_tax = taxService.getTax();

      const updatedRefundedOrderAmount = report.refunded_order_amount.map(
        (amount: number, i: number) => amount + data.refunded_order_amount[i],
      );

      if (report.card_number) {
        try {
          await this.prisma.$transaction([
            this.prisma.report.update({
              where: {
                id,
                shop_id: request.shop.id,
              },
              data: {
                ...report,
                refund_status: true,
                refunded_order_amount: updatedRefundedOrderAmount,
              },
            }),
            this.prisma.report.create({
              data: {
                ...report,
                refund_target_id: report.id,
                refund_status: true,
                refunded_order_amount: data.refunded_order_amount,
                id: undefined,
                created_at: undefined,
                updated_at: undefined,
                type: ReportType.REFUND,
                total_payment: -total_payment,
                total_tax,
                total_payment_after_tax_service:
                  -total_payment_after_tax_service,
                shop_id: request.shop.id,
              },
            }),
            this.prisma.card.update({
              where: {
                card_number: report.card_number,
                shop_id: request.shop.id,
              },
              data: {
                balance: {
                  increment: total_payment_after_tax_service,
                },
              },
            }),
          ]);

          return {
            statusCode: 200,
            message: 'OK',
          };
        } catch (error) {
          throw error;
        }
      } else {
        await this.prisma.$transaction([
          this.prisma.report.update({
            where: { id },
            data: {
              ...report,
              refund_status: true,
              refunded_order_amount: updatedRefundedOrderAmount,
            },
          }),
          this.prisma.report.create({
            data: {
              ...report,
              refund_target_id: report.id,
              refund_status: true,
              refunded_order_amount: data.refunded_order_amount,
              id: undefined,
              created_at: undefined,
              updated_at: undefined,
              type: ReportType.REFUND,
              total_payment: -total_payment,
              total_tax,
              total_payment_after_tax_service: -total_payment_after_tax_service,
            },
          }),
        ]);
      }
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
