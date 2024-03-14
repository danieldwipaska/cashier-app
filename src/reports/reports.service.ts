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
        status: 201,
        message: 'CREATED',
        data: report,
      };
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async findAll(): Promise<Response<Report[]>> {
    try {
      const reports: Report[] = await this.reportModel.find();
      if (!reports.length) throw new NotFoundException('Report Not Found');

      return {
        status: 200,
        message: 'OK',
        data: reports,
      };
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  findOne(id: number) {
    return `This action returns a #${id} report`;
  }

  update(id: number, updateReportDto: UpdateReportDto) {
    return `This action updates a #${id} report`;
  }

  remove(id: number) {
    return `This action removes a #${id} report`;
  }
}
