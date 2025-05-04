import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import Response from 'src/interfaces/response.interface';
import { BackofficeSetting } from '@prisma/client';
import { CreateBackofficeSettingDto } from './dto/create-backoffice-setting.dto';

@Injectable()
export class BackofficeSettingsService {
  constructor(private prisma: PrismaService) {}

  async create(
    createBackofficeSettingDto: CreateBackofficeSettingDto,
  ): Promise<Response<BackofficeSetting>> {
    try {
      const backofficeSetting = await this.prisma.backofficeSetting.create({
        data: createBackofficeSettingDto,
      });

      return {
        statusCode: 201,
        message: 'CREATED',
        data: backofficeSetting,
      };
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async findOne(id: string): Promise<Response<BackofficeSetting>> {
    try {
      const backofficeSetting = await this.prisma.backofficeSetting.findUnique({
        where: {
          id,
        },
        include: {
          CrewPurchaseCategory: true,
        },
      });

      return {
        statusCode: 200,
        message: 'OK',
        data: backofficeSetting,
      };
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
}
