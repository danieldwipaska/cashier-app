import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Card, Report } from '@prisma/client';
import { CardStatus, ReportStatus, ReportType } from 'src/enums/report';
import { PageMetaData } from 'src/interfaces/pagination.interface';
import Response from 'src/interfaces/response.interface';
import { PrismaService } from 'src/prisma.service';
import { countSkip, paginate } from 'src/utils/pagination.util';
import Randomize from 'src/utils/randomize.util';
import { CreateCardDto } from './dto/create-card.dto';
import { CreateReportWithCardDto } from 'src/reports/dto/create-report.dto';
import { orderDiscountedPrice, ServiceTax } from 'src/utils/calculation.util';
import { MethodsService } from 'src/methods/methods.service';
import { CustomLoggerService } from 'src/loggers/custom-logger.service';

@Injectable()
export class CardsService {
  constructor(
    private prisma: PrismaService,
    private methodsService: MethodsService,
    private readonly logger: CustomLoggerService,
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
      if (!card) throw new BadRequestException('Card creation failed');

      this.logger.logBusinessEvent(
        `New card created: ${card.card_number}`,
        'CARD_CREATED',
        'CARD',
        card.id,
        request.user?.username,
        null,
        card,
        createCardDto,
      );

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
      this.logger.logError(
        error,
        'CardsService.findAll',
        request.user?.username,
        request.requestId,
        { page, shop_id: request.shop?.id },
      );
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
      this.logger.logError(
        error,
        'CardsService.findOneByCardNumber',
        request.user?.username,
        request.requestId,
        { cardNumber, shop_id: request.shop.id },
      );
      throw error;
    }
  }

  async topUpAndActivate(
    id: string,
    customerName: string,
    customerId: string,
    addBalance: number,
    paymentMethodId: string,
    note: string,
    req: any,
  ): Promise<Response<Report>> {
    try {
      const card = await this.prisma.card.findUnique({ where: { id } });
      if (!card) throw new NotFoundException('Card Not Found');

      const method = await this.methodsService.findOne(req, paymentMethodId);
      if (!method) throw new NotFoundException('Payment Method Not Found');

      try {
        const balance: number = card.balance + addBalance;

        const [updatedCard, newReport] = await this.prisma.$transaction([
          this.prisma.card.update({
            where: {
              id,
              shop_id: req.shop.id,
            },
            data: {
              customer_name: customerName,
              customer_id: customerId,
              balance,
              status: CardStatus.ACTIVE,
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
              initial_balance: card.balance,
              final_balance: balance,
              total_payment: addBalance,
              total_payment_after_tax_service: addBalance,
              method_id: paymentMethodId,
              crew_id: req.crew.id,
              note,
              shop_id: req.shop.id,
            },
          }),
        ]);

        this.logger.logBusinessEvent(
          `Card topped up and activated: ${card.card_number}`,
          'CARD_TOPUP_ACTIVATED',
          'CARD',
          card.id,
          req.user?.username,
          card,
          updatedCard,
          {
            id,
            customerName,
            customerId,
            addBalance,
            paymentMethodId,
            note,
          },
        );

        this.logger.logBusinessEvent(
          `New report created: ${newReport.report_id}`,
          'REPORT_CREATED',
          'REPORT',
          newReport.id,
          req.user?.username,
          null,
          newReport,
          {
            id,
            customerName,
            customerId,
            addBalance,
            paymentMethodId,
            note,
          },
        );

        return {
          statusCode: 200,
          message: 'OK',
          data: newReport,
        };
      } catch (error) {
        console.log(error);
        throw error;
      }
    } catch (error) {
      this.logger.logError(
        error,
        'CardsService.topUpAndActivate',
        req.user?.username,
        req.requestId,
        {
          id,
          customerName,
          customerId,
          addBalance,
          paymentMethodId,
          note,
          shop_id: req.shop.id,
        },
      );
      throw error;
    }
  }

  async topUp(
    id: string,
    addBalance: number,
    paymentMethodId: string,
    note: string,
    req: any,
  ): Promise<Response<Report>> {
    try {
      const card = await this.prisma.card.findUnique({ where: { id } });
      if (!card) throw new NotFoundException('Card Not Found');

      const method = await this.methodsService.findOne(req, paymentMethodId);
      if (!method) throw new NotFoundException('Payment Method Not Found');

      try {
        const balance: number = card.balance + addBalance;

        const [updatedCard, newReport] = await this.prisma.$transaction([
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
              total_payment: addBalance,
              total_payment_after_tax_service: addBalance,
              initial_balance: card.balance,
              final_balance: balance,
              type: ReportType.TOPUP,
              status: ReportStatus.PAID,
              method_id: paymentMethodId,
              crew_id: req.crew.id,
              note,
              shop_id: req.shop.id,
            },
          }),
        ]);

        this.logger.logBusinessEvent(
          `Card topped up: ${card.card_number}`,
          'CARD_TOPUP',
          'CARD',
          card.id,
          req.user?.username,
          card,
          updatedCard,
          {
            id,
            addBalance,
            paymentMethodId,
            note,
          },
        );

        this.logger.logBusinessEvent(
          `New report created: ${newReport.report_id}`,
          'REPORT_CREATED',
          'REPORT',
          newReport.id,
          req.user?.username,
          null,
          newReport,
          {
            id,
            addBalance,
            paymentMethodId,
            note,
          },
        );

        return {
          statusCode: 200,
          message: 'OK',
          data: newReport,
        };
      } catch (error) {
        this.logger.logError(
          error,
          'CardsService.topUp',
          req.user?.username,
          req.requestId,
          {
            id,
            addBalance,
            paymentMethodId,
            note,
            shop_id: req.shop.id,
          },
        );
        throw error;
      }
    } catch (error) {
      this.logger.logError(
        error,
        'CardsService.topUp',
        req.user?.username,
        req.requestId,
        {
          id,
          addBalance,
          paymentMethodId,
          note,
          shop_id: req.shop.id,
        },
      );
      throw error;
    }
  }

  async checkout(
    id: string,
    paymentMethodId: string,
    note: string,
    req: any,
  ): Promise<Response<Report>> {
    try {
      const card = await this.prisma.card.findUnique({ where: { id } });
      if (!card) throw new NotFoundException('Card Not Found');

      const method = await this.methodsService.findOne(req, paymentMethodId);
      if (!method) throw new NotFoundException('Payment Method Not Found');

      try {
        const [updatedCard, newReport] = await this.prisma.$transaction([
          this.prisma.card.update({
            where: {
              id,
              shop_id: req.shop.id,
            },
            data: {
              status: CardStatus.INACTIVE,
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
              total_payment: card.balance,
              total_payment_after_tax_service: card.balance,
              initial_balance: card.balance,
              final_balance: 0,
              type: ReportType.CHECKOUT,
              status: ReportStatus.PAID,
              crew_id: req.crew.id,
              method_id: paymentMethodId,
              note,
              shop_id: req.shop.id,
            },
          }),
        ]);

        this.logger.logBusinessEvent(
          `Card checked out: ${card.card_number}`,
          'CARD_CHECKOUT',
          'CARD',
          card.id,
          req.user?.username,
          card,
          updatedCard,
          {
            id,
            paymentMethodId,
            note,
          },
        );

        this.logger.logBusinessEvent(
          `New report created: ${newReport.report_id}`,
          'REPORT_CREATED',
          'REPORT',
          newReport.id,
          req.user?.username,
          null,
          newReport,
          {
            id,
            paymentMethodId,
            note,
          },
        );

        return {
          statusCode: 200,
          message: 'OK',
          data: newReport,
        };
      } catch (error) {
        this.logger.logError(
          error,
          'CardsService.checkout',
          req.user?.username,
          req.requestId,
          {
            id,
            paymentMethodId,
            note,
          },
        );
        throw error;
      }
    } catch (error) {
      this.logger.logError(
        error,
        'CardsService.checkout',
        req.user?.username,
        req.requestId,
        {
          id,
          paymentMethodId,
          note,
        },
      );
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
        const [updatedCard, newReport] = await this.prisma.$transaction([
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
              total_payment: adjustedBalance - card.balance,
              total_payment_after_tax_service: adjustedBalance - card.balance,
              initial_balance: card.balance,
              final_balance: adjustedBalance,
              type: ReportType.ADJUSTMENT,
              status: ReportStatus.PAID,
              crew_id: req.crew.id,
              note,
              shop_id: req.shop.id,
            },
          }),
        ]);

        this.logger.logBusinessEvent(
          `Card balance adjusted: ${card.card_number}`,
          'CARD_ADJUSTMENT',
          'CARD',
          card.id,
          req.user?.username,
          card,
          updatedCard,
          {
            id,
            adjustedBalance,
            note,
          },
        );

        this.logger.logBusinessEvent(
          `New report created: ${newReport.report_id}`,
          'REPORT_CREATED',
          'REPORT',
          newReport.id,
          req.user?.username,
          null,
          newReport,
          {
            id,
            adjustedBalance,
            note,
          },
        );

        return {
          statusCode: 200,
          message: 'OK',
          data: newReport,
        };
      } catch (error) {
        this.logger.logError(
          error,
          'CardsService.adjustBalance',
          req.user?.username,
          req.requestId,
          {
            id,
            adjustedBalance,
            note,
          },
        );
        throw error;
      }
    } catch (error) {
      this.logger.logError(
        error,
        'CardsService.adjustBalance',
        req.user?.username,
        req.requestId,
        {
          id,
          adjustedBalance,
          note,
        },
      );
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
      method_id,
      crew_id,
      note,
      items,
    } = data;

    const newReportData: any = {
      report_id: Randomize.generateReportId('PAY', 6),
      type,
      status: status || ReportStatus.PAID,
      customer_name,
      customer_id,
      crew_id,
      method_id,
      note: note || '',
      total_payment: 0,
      shop_id: req.shop.id,
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

    try {
      const [updatedCard, newReport] = await this.prisma.$transaction([
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
          include: { Item: true },
        }),
      ]);

      this.logger.logBusinessEvent(
        `Card updated: ${updatedCard.card_number}`,
        'CARD_PAY',
        'CARD',
        updatedCard.id,
        req.user?.username,
        card,
        updatedCard,
        {
          id,
          data,
        },
      );

      this.logger.logBusinessEvent(
        `New report created: ${newReport.report_id}`,
        'REPORT_CREATED',
        'REPORT',
        newReport.id,
        req.user?.username,
        null,
        newReport,
        {
          id,
          data,
        },
      );

      return {
        statusCode: 200,
        message: 'OK',
        data: newReport,
      };
    } catch (error) {
      this.logger.logError(
        error,
        'CardsService.pay',
        req.user?.username,
        req.requestId,
        {
          id,
          data,
        },
      );
      throw error;
    }
  }
}
