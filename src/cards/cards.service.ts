import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Card, Prisma, Report } from '@prisma/client';
import { CrewsService } from 'src/crews/crews.service';
import { ReportType } from 'src/enums/report';
import Response from 'src/interfaces/response.interface';
import { PrismaService } from 'src/prisma.service';

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

  async findAll(): Promise<Response<Card[]>> {
    try {
      const cards = await this.prisma.card.findMany({
        orderBy: { updated_at: 'desc' },
      });
      if (!cards.length) throw new NotFoundException('No cards found');

      return {
        statusCode: 200,
        message: 'OK',
        data: cards,
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
  ): Promise<Response<Report>> {
    try {
      const card = await this.prisma.card.findUnique({ where: { id } });
      if (!card) throw new NotFoundException('Card Not Found');

      try {
        const balance: number = card.balance + addBalance;

        const [updatedCard, report] = await this.prisma.$transaction([
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
              type: ReportType.TOPUP_AND_ACTIVATE,
              customer_name: customerName,
              customer_id: customerId,
              card_number: card.card_number,
              payment_method: paymentMethod,
              served_by: 'Greeter',
              initial_balance: card.balance,
              final_balance: balance,
              total_payment: addBalance,
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
  ): Promise<Response<Report>> {
    try {
      const card = await this.prisma.card.findUnique({ where: { id } });
      if (!card) throw new NotFoundException('Card Not Found');

      try {
        const balance: number = card.balance + addBalance;

        const [updatedCard, report] = await this.prisma.$transaction([
          this.prisma.card.update({
            where: { id },
            data: { balance },
          }),
          this.prisma.report.create({
            data: {
              customer_name: card.customer_name,
              customer_id: card.customer_id,
              card_number: card.card_number,
              payment_method: paymentMethod,
              served_by: 'Greeter',
              total_payment: addBalance,
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
  ): Promise<Response<Report>> {
    try {
      const card = await this.prisma.card.findUnique({ where: { id } });
      if (!card) throw new NotFoundException('Card Not Found');

      try {
        const [updatedCard, report] = await this.prisma.$transaction([
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
              customer_name: card.customer_name,
              customer_id: card.customer_id,
              card_number: card.card_number,
              served_by: 'Greeter',
              total_payment: card.balance,
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
  ): Promise<Response<Report>> {
    try {
      const card = await this.prisma.card.findUnique({ where: { id } });
      if (!card) throw new NotFoundException('Card Not Found');

      try {
        const [updatedCard, report] = await this.prisma.$transaction([
          this.prisma.card.update({
            where: { id },
            data: {
              balance: adjustedBalance,
            },
          }),
          this.prisma.report.create({
            data: {
              customer_name: card.customer_name,
              customer_id: card.customer_id,
              card_number: card.card_number,
              served_by: 'Greeter',
              total_payment: adjustedBalance - card.balance,
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
          const balance: number = card.balance - data.total_payment;
          if (balance < 5000 && balance > 0)
            throw new BadRequestException(
              'Card Balance cannot be less than minimal balance',
            );

          if (balance < 0)
            throw new BadRequestException(
              'Card Balance cannot be less than zero',
            );

          const [updatedCard, report] = await this.prisma.$transaction([
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
