import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Card, Prisma, Report } from '@prisma/client';
import { CrewsService } from 'src/crews/crews.service';
import { ReportStatus, ReportType } from 'src/enums/report';
import { PageMetaData } from 'src/interfaces/pagination.interface';
import Response from 'src/interfaces/response.interface';
import { PrismaService } from 'src/prisma.service';
import { countSkip, paginate } from 'src/utils/pagination.util';
import Randomize from 'src/utils/randomize.util';
import { CreateCardDto } from './dto/create-card.dto';
import { CreateReportWithCardDto } from 'src/reports/dto/create-report.dto';
import {
  calculateTaxService,
  orderDiscountedPrice,
} from 'src/utils/calculation.util';

@Injectable()
export class CardsService {
  constructor(
    private prisma: PrismaService,
    private crewsService: CrewsService,
  ) {}

  async create(data: CreateCardDto): Promise<Response<Card>> {
    try {
      const card = await this.prisma.card.create({ data });

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

  async findAll(page?: number): Promise<Response<Card[]>> {
    const take = 15;

    try {
      const skip = countSkip(take, page);
      const [cards, totalCards] = await Promise.all([
        this.prisma.card.findMany({
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

  async findOneByCardNumber(cardNumber: string): Promise<Response<Card>> {
    try {
      const card = await this.prisma.card.findUnique({
        where: { card_number: cardNumber },
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
            where: { id },
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
            where: { id },
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
            where: { id },
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
            where: { id },
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
    username?: string,
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

    const newReportData: Prisma.ReportCreateInput = {
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
    };

    try {
      const crew = await this.crewsService.findOne(crew_id);
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
    const user = await this.prisma.user.findUnique({
      where: { username },
      include: {
        shops: {
          include: {
            shop: true,
          },
        },
      },
    });
    if (!user) throw new NotFoundException('User Not Found');

    newReportData.tax_service_included =
      user.shops[0].shop.included_tax_service;

    let totalTaxService = 0;
    let taxPercent = 0;
    let servicePercent = 0;
    if (!user.shops[0].shop.included_tax_service) {
      totalTaxService = calculateTaxService({
        totalPayment,
        servicePercent: user.shops[0].shop.service,
        taxPercent: user.shops[0].shop.tax,
      });
      taxPercent = user.shops[0].shop.tax;
      servicePercent = user.shops[0].shop.service;
    }

    newReportData.tax_percent = taxPercent;
    newReportData.service_percent = servicePercent;
    newReportData.total_tax_service = totalTaxService;
    newReportData.total_payment_after_tax_service =
      totalPayment + totalTaxService;

    let balance = 0;
    try {
      const card = await this.prisma.card.findUnique({
        where: { id },
      });
      if (!card) throw new NotFoundException('Card Not Found');

      balance = card.balance - (totalPayment + totalTaxService);
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

  async remove(id: string): Promise<Response<Card>> {
    try {
      const card = await this.prisma.card.findUnique({ where: { id } });
      if (!card) throw new NotFoundException('Card Not Found');

      try {
        const deletedCard = await this.prisma.card.delete({ where: { id } });

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
