import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import Response from 'src/interfaces/response.interface';
import { BackofficeSetting } from '@prisma/client';
import { CreateBackofficeSettingDto } from './dto/create-backoffice-setting.dto';
import { UpdateBackofficeSettingDto } from './dto/update-backoffice-setting.dto';
import { CustomLoggerService } from 'src/loggers/custom-logger.service';

@Injectable()
export class BackofficeSettingsService {
  constructor(
    private prisma: PrismaService,
    private readonly logger: CustomLoggerService,
  ) {}

  async create(
    request: any,
    createBackofficeSettingDto: CreateBackofficeSettingDto,
  ): Promise<Response<BackofficeSetting>> {
    try {
      const backofficeSetting = await this.prisma.backofficeSetting.create({
        data: createBackofficeSettingDto,
      });
      if (!backofficeSetting)
        throw new NotFoundException('Backoffice Setting not found');

      this.logger.logBusinessEvent(
        `New backoffice setting created for shop: ${backofficeSetting.shop_id}`,
        'BACKOFFICE_SETTING_CREATED',
        'BACKOFFICE_SETTING',
        backofficeSetting.id,
        request.user?.username,
        null,
        backofficeSetting,
        createBackofficeSettingDto,
      );

      return {
        statusCode: 201,
        message: 'CREATED',
        data: backofficeSetting,
      };
    } catch (error) {
      this.logger.logError(
        error,
        'BackofficeSettingsService.create',
        request.user?.username,
        request.requestId,
        createBackofficeSettingDto,
      );
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
      this.logger.logError(
        error,
        'BackofficeSettingsService.findOne',
        req.user?.username,
        req.requestId,
        { shop_id: req.shop.id },
      );
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
        const [
          deletedCrewPurchaseCategories,
          newCrewPurchaseCategories,
          updatedBackofficeSetting,
        ] = await this.prisma.$transaction([
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
            include: {
              shop: true,
            },
          }),
        ]);

        this.logger.logBusinessEvent(
          `BackofficeSetting updated on shop: ${updatedBackofficeSetting.shop.name}`,
          'CATEGORY_UPDATED',
          'CATEGORY',
          backofficeSetting.id,
          req.user?.username,
          {
            backofficeSetting,
          },
          {
            deletedCrewPurchaseCategories,
            newCrewPurchaseCategories,
            updatedBackofficeSetting,
          },
          updateBackofficeSettingDto,
        );

        return {
          statusCode: 200,
          message: 'OK',
          data: backofficeSetting,
        };
      } catch (error) {
        this.logger.logError(
          error,
          'BackofficeSettingsService.update',
          req.user?.username,
          req.requestId,
          updateBackofficeSettingDto,
        );
        throw error;
      }
    } catch (error) {
      this.logger.logError(
        error,
        'BackofficeSettingsService.update',
        req.user?.username,
        req.requestId,
        updateBackofficeSettingDto,
      );
      throw error;
    }
  }
}
