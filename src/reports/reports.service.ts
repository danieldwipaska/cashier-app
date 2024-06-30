import { Injectable, NotFoundException } from '@nestjs/common';
import Response from 'src/interfaces/response.interface';
import { Prisma, Report } from '@prisma/client';
import { PrismaService } from 'src/prisma.service';
import { CrewsService } from 'src/crews/crews.service';
import { ReportType } from 'src/enums/report';

@Injectable()
export class ReportsService {
  constructor(
    private prisma: PrismaService,
    private crewsService: CrewsService,
  ) {}

  async create(data: Prisma.ReportCreateInput): Promise<Response<Report>> {
    try {
      // Check whether crew exists
      const crew = await this.crewsService.findOne(data.crew_id);
      if (!crew) throw new NotFoundException('Crew Not Found');

      try {
        const report = await this.prisma.report.create({
          data: {
            ...data,
            served_by: crew.data.name,
            crew_id: crew.data.id,
          },
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
    } catch (error) {
      throw error;
    }
  }

  async findAll(
    from: string,
    to: string,
    filter: { status: string },
  ): Promise<Response<Report[]>> {
    try {
      let reports = await this.prisma.report.findMany({
        orderBy: { updated_at: 'desc' },
        where: filter,
      });
      if (!reports.length) throw new NotFoundException('Report Not Found');

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

      return {
        statusCode: 200,
        message: 'OK',
        data: reports,
      };
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async findOne(id: string): Promise<Response<Report>> {
    try {
      const report = await this.prisma.report.findUnique({
        where: { id },
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
    cardNumber: string,
    customerId: string,
  ): Promise<Response<Report[]>> {
    try {
      const reports = await this.prisma.report.findMany({
        where: {
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
      console.log('nothing');
    }
  }

  async update(
    id: string,
    data: Prisma.ReportUpdateInput,
  ): Promise<Response<Report>> {
    try {
      const report = await this.prisma.report.update({
        where: { id },
        data,
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

  async refundPartially(id: string, data: any): Promise<Response<Report>> {
    console.log(data);
    try {
      const report = await this.prisma.report.findUnique({ where: { id } });
      if (!report) throw new NotFoundException('Report Not Found');

      // Refund Data
      let total_payment = 0;

      data.refunded_order_amount.forEach((amount: number, index: number) => {
        if (report.order_discount_status[index]) {
          total_payment +=
            amount *
            (report.order_price[index] +
              (report.order_price[index] *
                report.order_discount_percent[index]) /
                100);
        } else {
          total_payment += amount * report.order_price[index];
        }
      });

      const total_tax_service =
        total_payment * (report.service_percent / 100) +
        (total_payment + total_payment * (report.service_percent / 100)) *
          (report.tax_percent / 100);

      const total_payment_after_tax_service = total_payment + total_tax_service;

      try {
        const [updatedReport, newReport] = await this.prisma.$transaction([
          this.prisma.report.update({
            where: { id },
            data: {
              ...data,
              refund_status: true,
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
              type: 'refund',
              total_payment: -total_payment,
              total_tax_service,
              total_payment_after_tax_service: -total_payment_after_tax_service,
            },
          }),
        ]);

        return {
          statusCode: 200,
          message: 'OK',
          data: updatedReport,
        };
      } catch (error) {
        throw error;
      }
    } catch (error) {
      throw error;
    }
  }

  async remove(id: string): Promise<Response<Report>> {
    try {
      const report = await this.prisma.report.findUnique({ where: { id } });
      if (!report) throw new NotFoundException('Report Not Found');

      try {
        const deletedReport = await this.prisma.report.delete({
          where: { id },
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
