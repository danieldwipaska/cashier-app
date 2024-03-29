import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateReportDto } from './dto/create-report.dto';
import { UpdateReportDto } from './dto/update-report.dto';
import Response from 'src/interfaces/response.interface';
import { Report } from './entities/report.entity';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class ReportsService {
  constructor(@InjectModel(Report.name) private reportModel: Model<Report>) {}

  async create(createReportDto: CreateReportDto): Promise<Response<Report>> {
    try {
      const newReport = new this.reportModel({
        id: String(Date.now()),
        ...createReportDto,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      });

      const report = await newReport.save();

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

  async findAll(from: string, to: string): Promise<Response<Report[]>> {
    try {
      let reports: Report[] = await this.reportModel
        .find()
        .sort({ createdAt: -1 });
      if (!reports.length) throw new NotFoundException('Report Not Found');

      if (from && to) {
        const timeInterval: { from: number; to: number } = {
          from: Date.parse(from),
          to: Date.parse(to),
        };

        reports = reports.filter(
          (report: Report) =>
            report.createdAt >= timeInterval.from &&
            report.createdAt <= timeInterval.to,
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
      const report: Report = await this.reportModel.findOne({ id });
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

  async update(
    id: number,
    updateReportDto: UpdateReportDto,
  ): Promise<Response<Report>> {
    try {
      const report: Report = await this.reportModel.findOneAndUpdate(
        { id },
        updateReportDto,
        { returnDocument: 'after' },
      );
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

  async remove(id: string): Promise<Response<Report>> {
    try {
      const report: Report = await this.reportModel.findOneAndDelete({ id });
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
}
