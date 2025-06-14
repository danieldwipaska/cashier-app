import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import Response from 'src/interfaces/response.interface';
import { BackofficeSetting } from '@prisma/client';
import { CreateBackofficeSettingDto } from './dto/create-backoffice-setting.dto';
import { UpdateBackofficeSettingDto } from './dto/update-backoffice-setting.dto';

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

  async findOne(req: any): Promise<Response<BackofficeSetting>> {
    try {
      const backofficeSetting = await this.prisma.backofficeSetting.findUnique({
        where: {
          shop_id: req.shop.id,
        },
        include: {
          CrewPurchaseCategory: {
            include: {
              category: true,
            },
          },
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

  async update(
    req: any,
    updateBackofficeSettingDto: UpdateBackofficeSettingDto,
  ): Promise<Response<BackofficeSetting>> {
    const { crewPurchaseCategories, ...data } = updateBackofficeSettingDto;
    try {
      const backofficeSetting = await this.prisma.backofficeSetting.findUnique({
        where: {
          shop_id: req.shop.id,
        },
      });
      if (!backofficeSetting)
        throw new NotFoundException('Backoffice Setting not found');

      try {
        await this.prisma.$transaction([
          this.prisma.crewPurchaseCategory.deleteMany({
            where: { backoffice_setting_id: backofficeSetting.id },
          }),
          this.prisma.crewPurchaseCategory.createMany({
            data: crewPurchaseCategories.map((crewPurchaseCategory) => ({
              backoffice_setting_id: backofficeSetting.id,
              category_id: crewPurchaseCategory.category_id,
            })),
          }),
          this.prisma.backofficeSetting.update({
            where: {
              id: backofficeSetting.id,
            },
            data,
          }),
        ]);
      } catch (error) {}

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
