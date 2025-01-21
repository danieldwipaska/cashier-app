import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Card, Prisma, Report } from '@prisma/client';
import { CrewsService } from 'src/crews/crews.service';
import { ReportType } from 'src/enums/report';
import { PageMetaData } from 'src/interfaces/pagination.interface';
import Response from 'src/interfaces/response.interface';
import { PrismaService } from 'src/prisma.service';
import { countSkip, paginate } from 'src/utils/pagination.util';
import Randomize from 'src/utils/randomize.util';

@Injectable()
export class CardsService {
  constructor(
    private prisma: PrismaService,
    private crewsService: CrewsService,
  ) {}

  async create(data: Prisma.CardCreateInput): Promise<Response<Card>> {
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
    const skip = countSkip(take, page);

    try {
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
    data: Prisma.ReportCreateInput,
  ): Promise<Response<Report>> {
    try {
      // Check whether card exists
      const card = await this.prisma.card.findUnique({ where: { id } });
      if (!card) throw new NotFoundException('Card Not Found');

      try {
        // Check whether crew exists
        const crew = await this.crewsService.findOne(data.crew_id);
        if (!crew) throw new NotFoundException('Crew Not Found');

        try {
          const balance: number =
            card.balance - data.total_payment_after_tax_service;
          if (balance < 5000 && balance > 0)
            throw new BadRequestException(
              'Card Balance cannot be less than minimal balance',
            );

          if (balance < 0)
            throw new BadRequestException(
              'Card Balance cannot be less than zero',
            );

          const [, report] = await this.prisma.$transaction([
            this.prisma.card.update({
              where: { id },
              data: {
                balance,
              },
            }),
            this.prisma.report.create({
              data: {
                ...data,
                initial_balance: card.balance,
                final_balance: balance,
                type: ReportType.PAY,
                served_by: crew.data.name,
                report_id: Randomize.generateReportId('PAY', 6),
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
        throw error;
      }
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
