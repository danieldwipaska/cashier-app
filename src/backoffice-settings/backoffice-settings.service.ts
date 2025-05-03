import { Injectable } from '@nestjs/common';
import { CreateBackofficeSettingDto } from './dto/create-backoffice-setting.dto';
import { UpdateBackofficeSettingDto } from './dto/update-backoffice-setting.dto';
import { PrismaService } from 'src/prisma.service';
import { BackofficeSettings } from '@prisma/client';
import Response from 'src/interfaces/response.interface';

@Injectable()
export class BackofficeSettingsService {
  constructor(private prisma: PrismaService) {}

  async create(
    createBackofficeSettingDto: CreateBackofficeSettingDto,
  ): Promise<Response<BackofficeSettings>> {
    const { categoryIds, ...data } = createBackofficeSettingDto;

    try {
      const backofficeSetting = await this.prisma.backofficeSettings.create({
        data: {
          ...data,
          purchase_categories: {
            connect: categoryIds?.map((id) => ({ id })) || [],
          },
        },
        include: {
          purchase_categories: true,
        },
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

  async findAll(): Promise<Response<BackofficeSettings[]>> {
    try {
      const backofficeSettings = await this.prisma.backofficeSettings.findMany({
        include: {
          purchase_categories: true,
        },
      });

      return {
        statusCode: 200,
        message: 'OK',
        data: backofficeSettings,
      };
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async update(
    id: string,
    updateBackofficeSettingDto: UpdateBackofficeSettingDto,
  ): Promise<Response<BackofficeSettings>> {
    const { categoryIds, ...data } = updateBackofficeSettingDto;

    try {
      // Update with proper category connections
      const backofficeSetting = await this.prisma.backofficeSettings.update({
        where: { id },
        data: {
          ...data,
          purchase_categories: categoryIds
            ? {
                // If categoryIds is provided, disconnect all existing categories and connect new ones
                set: [],
                connect: categoryIds.map((categoryId) => ({ id: categoryId })),
              }
            : undefined,
        },
        include: {
          purchase_categories: true,
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

  async remove(id: string) {
    return this.prisma.backofficeSettings.delete({
      where: { id },
      include: {
        purchase_categories: true,
      },
    });
  }
}
