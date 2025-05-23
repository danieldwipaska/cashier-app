import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Card, Report } from '@prisma/client';
import { CrewsService } from 'src/crews/crews.service';
import { ReportStatus, ReportType } from 'src/enums/report';
import { PageMetaData } from 'src/interfaces/pagination.interface';
import Response from 'src/interfaces/response.interface';
import { PrismaService } from 'src/prisma.service';
import { countSkip, paginate } from 'src/utils/pagination.util';
import Randomize from 'src/utils/randomize.util';
import { CreateCardDto } from './dto/create-card.dto';
import { CreateReportWithCardDto } from 'src/reports/dto/create-report.dto';
import { orderDiscountedPrice, ServiceTax } from 'src/utils/calculation.util';

@Injectable()
export class CardsService {
  constructor(
    private prisma: PrismaService,
    private crewsService: CrewsService,
  ) {}

  async create(
    request: any,
    createCardDto: CreateCardDto,
  ): Promise<Response<Card>> {
    try {
      const card = await this.prisma.card.create({
        data: {
          ...createCardDto,
          shop_id: request.shop.id,
        },
      });

      return {
        statusCode: 201,
        message: 'CREATED',
        data: card,
      };
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async findAll(request: any, page?: number): Promise<Response<Card[]>> {
    const take = 15;

    try {
      const skip = countSkip(take, page);
      const [cards, totalCards] = await Promise.all([
        this.prisma.card.findMany({
          where: {
            shop_id: request.shop.id,
          },
          orderBy: {
            updated_at: 'desc',
          },
          take,
          skip: skip,
        }),
        this.prisma.card.count(),
      ]);
      if (!totalCards) throw new NotFoundException('No cards found');

      const pageMetaData: PageMetaData = paginate(page, take, totalCards);

      return {
        statusCode: 200,
        message: 'OK',
        data: cards,
        pageMetaData,
      };
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async findOneByCardNumber(
    request: any,
    cardNumber: string,
  ): Promise<Response<Card>> {
    try {
      const params = {
        card_number: cardNumber,
        shop_id: request.shop.id,
      };

      const card = await this.prisma.card.findUnique({
        where: params,
      });
      if (!card) throw new NotFoundException('Card Not Found');

      return {
        statusCode: 200,
        message: 'OK',
        data: card,
      };
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async topUpAndActivate(
    id: string,
    customerName: string,
    customerId: string,
    addBalance: number,
    paymentMethod: string,
    note: string,
    req: any,
  ): Promise<Response<Report>> {
    try {
      const card = await this.prisma.card.findUnique({ where: { id } });
      if (!card) throw new NotFoundException('Card Not Found');

      try {
        const balance: number = card.balance + addBalance;

        const [, report] = await this.prisma.$transaction([
          this.prisma.card.update({
            where: {
              id,
              shop_id: req.shop.id,
            },
            data: {
              customer_name: customerName,
              customer_id: customerId,
              balance,
              status: 'active',
            },
          }),
          this.prisma.report.create({
            data: {
              report_id: Randomize.generateReportId('TOP', 6),
              type: ReportType.TOPUP_AND_ACTIVATE,
              status: ReportStatus.PAID,
              customer_name: customerName,
              customer_id: customerId,
              card_number: card.card_number,
              payment_method: paymentMethod,
              served_by: req.crewName,
              initial_balance: card.balance,
              final_balance: balance,
              total_payment: addBalance,
              total_payment_after_tax_service: addBalance,
              note,
              shop_id: req.shop.id,
            },
          }),
        ]);

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

  async topUp(
    id: string,
    addBalance: number,
    paymentMethod: string,
    note: string,
    req: any,
  ): Promise<Response<Report>> {
    try {
      const card = await this.prisma.card.findUnique({ where: { id } });
      if (!card) throw new NotFoundException('Card Not Found');

      try {
        const balance: number = card.balance + addBalance;

        const [, report] = await this.prisma.$transaction([
          this.prisma.card.update({
            where: {
              id,
              shop_id: req.shop.id,
            },
            data: { balance },
          }),
          this.prisma.report.create({
            data: {
              report_id: Randomize.generateReportId('TOP', 6),
              customer_name: card.customer_name,
              customer_id: card.customer_id,
              card_number: card.card_number,
              payment_method: paymentMethod,
              served_by: req.crewName,
              total_payment: addBalance,
              total_payment_after_tax_service: addBalance,
              initial_balance: card.balance,
              final_balance: balance,
              type: ReportType.TOPUP,
              status: ReportStatus.PAID,
              note,
              shop_id: req.shop.id,
            },
          }),
        ]);

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

  async checkout(
    id: string,
    paymentMethod: string,
    note: string,
    req: any,
  ): Promise<Response<Report>> {
    try {
      const card = await this.prisma.card.findUnique({ where: { id } });
      if (!card) throw new NotFoundException('Card Not Found');

      try {
        const [, report] = await this.prisma.$transaction([
          this.prisma.card.update({
            where: {
              id,
              shop_id: req.shop.id,
            },
            data: {
              status: 'inactive',
              customer_id: '',
              customer_name: '',
              balance: 0,
            },
          }),
          this.prisma.report.create({
            data: {
              report_id: Randomize.generateReportId('CHE', 6),
              customer_name: card.customer_name,
              customer_id: card.customer_id,
              card_number: card.card_number,
              served_by: req.crewName,
              total_payment: card.balance,
              total_payment_after_tax_service: card.balance,
              initial_balance: card.balance,
              final_balance: 0,
              type: ReportType.CHECKOUT,
              payment_method: paymentMethod,
              status: ReportStatus.PAID,
              note,
              shop_id: req.shop.id,
            },
          }),
        ]);

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

  async adjustBalance(
    id: string,
    adjustedBalance: number,
    note: string,
    req: any,
  ): Promise<Response<Report>> {
    try {
      const card = await this.prisma.card.findUnique({ where: { id } });
      if (!card) throw new NotFoundException('Card Not Found');

      try {
        const [, report] = await this.prisma.$transaction([
          this.prisma.card.update({
            where: {
              id,
              shop_id: req.shop.id,
            },
            data: {
              balance: adjustedBalance,
            },
          }),
          this.prisma.report.create({
            data: {
              report_id: Randomize.generateReportId('ADJ', 6),
              customer_name: card.customer_name,
              customer_id: card.customer_id,
              card_number: card.card_number,
              served_by: req.crewName,
              total_payment: adjustedBalance - card.balance,
              total_payment_after_tax_service: adjustedBalance - card.balance,
              initial_balance: card.balance,
              final_balance: adjustedBalance,
              type: ReportType.ADJUSTMENT,
              status: ReportStatus.PAID,
              payment_method: '',
              note,
              shop_id: req.shop.id,
            },
          }),
        ]);

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

  async pay(
    id: string,
    data: CreateReportWithCardDto,
    req: any,
  ): Promise<Response<Report>> {
    const {
      type,
      status,
      customer_name,
      customer_id,
      payment_method,
      order_id,
      order_amount,
      crew_id,
      note,
    } = data;

    const newReportData: any = {
      report_id: Randomize.generateReportId('PAY', 6),
      type,
      status: status || ReportStatus.PAID,
      customer_name,
      customer_id,
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
      if (orderDiscountStatus) {
        totalPayment += orderDiscountedPrice({
          price: orderPrice[index],
          amount,
          discountPercent: orderDiscountPercent[index],
        });
      } else {
        totalPayment += amount * orderPrice[index];
      }
    });

    newReportData.total_payment = totalPayment;

    // CALCULATE TAX AND SERVICE
    const user = await this.prisma.user.findUnique({
      where: { username: req.user.username },
      include: {
        shops: {
          include: {
            shop: true,
          },
        },
      },
    });
    if (!user) throw new NotFoundException('User Not Found');

    newReportData.included_tax_service =
      user.shops[0].shop.included_tax_service;

    const taxService = new ServiceTax(
      totalPayment,
      user.shops[0].shop.service,
      user.shops[0].shop.tax,
    );

    if (!user.shops[0].shop.included_tax_service) {
      newReportData.total_payment_after_tax_service = taxService.calculateTax();
    } else {
      newReportData.total_payment_after_tax_service = totalPayment;
    }

    newReportData.tax_percent = taxService.taxPercent;
    newReportData.service_percent = taxService.servicePercent;
    newReportData.total_tax = taxService.getTax();

    let balance = 0;
    try {
      const card = await this.prisma.card.findUnique({
        where: {
          id,
          shop_id: req.shop.id,
        },
      });
      if (!card) throw new NotFoundException('Card Not Found');

      balance = card.balance - taxService.calculateTax();
      if (balance < 5000 && balance > 0)
        throw new BadRequestException(
          'Card Balance cannot be less than minimal balance',
        );

      if (balance < 0)
        throw new BadRequestException('Card Balance cannot be less than zero');

      newReportData.card_number = card.card_number;
      newReportData.initial_balance = card.balance;
      newReportData.final_balance = balance;
    } catch (error) {
      console.log(error);
      throw error;
    }

    try {
      const [, report] = await this.prisma.$transaction([
        this.prisma.card.update({
          where: {
            id,
            shop_id: req.shop.id,
          },
          data: {
            balance,
          },
        }),
        this.prisma.report.create({
          data: newReportData,
        }),
      ]);

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

  async remove(id: string, req: any): Promise<Response<Card>> {
    try {
      const card = await this.prisma.card.findUnique({ where: { id } });
      if (!card) throw new NotFoundException('Card Not Found');

      try {
        const deletedCard = await this.prisma.card.delete({
          where: {
            id,
            shop_id: req.shop.id,
          },
        });

        return {
          statusCode: 200,
          message: 'OK',
          data: deletedCard,
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
