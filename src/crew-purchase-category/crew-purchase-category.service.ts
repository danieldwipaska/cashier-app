import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCrewPurchaseCategoryDto } from './dto/create-crew-purchase-category.dto';
import { PrismaService } from 'src/prisma.service';
import { CrewPurchaseCategory } from '@prisma/client';
import Response from 'src/interfaces/response.interface';
import { CustomLoggerService } from 'src/loggers/custom-logger.service';

@Injectable()
export class CrewPurchaseCategoryService {
  constructor(
    private prisma: PrismaService,
    private readonly logger: CustomLoggerService,
  ) {}

  async create(
    request: any,
    createCrewPurchaseCategoryDto: CreateCrewPurchaseCategoryDto,
  ): Promise<Response<CrewPurchaseCategory>> {
    try {
      const crewPurchaseCategory =
        await this.prisma.crewPurchaseCategory.create({
          data: createCrewPurchaseCategoryDto,
          include: {
            category: true,
          },
        });

      this.logger.logBusinessEvent(
        `Crew purchases are calculated by category: ${crewPurchaseCategory.category.name}`,
        'CREW_PURCHASE_CATEGORY_CREATED',
        'CREW_PURCHASE_CATEGORY',
        crewPurchaseCategory.backoffice_setting_id,
        request.user?.username,
        null,
        crewPurchaseCategory,
        createCrewPurchaseCategoryDto,
      );

      return {
        statusCode: 201,
        message: 'CREATED',
        data: crewPurchaseCategory,
      };
    } catch (error) {
      this.logger.logError(
        error,
        'CrewPurchaseCategoryService.create',
        request.user?.username,
        request.requestId,
        createCrewPurchaseCategoryDto,
      );
      throw error;
    }
  }

  async findAll(
    request: any,
    backoffice_setting_id: string,
  ): Promise<Response<CrewPurchaseCategory[]>> {
    try {
      const crewPurchaseCategory =
        await this.prisma.crewPurchaseCategory.findMany({
          where: {
            backoffice_setting: {
              id: backoffice_setting_id,
              shop_id: request.shop.id,
            },
          },
        });

      return {
        statusCode: 200,
        message: 'OK',
        data: crewPurchaseCategory,
      };
    } catch (error) {
      this.logger.logError(
        error,
        'CrewPurchaseCategoryService.findAll',
        request.user?.username,
        request.requestId,
        {
          backoffice_setting_id,
        },
      );
      throw error;
    }
  }

  async remove(
    request: any,
    backoffice_setting_id: string,
    category_id: string,
  ): Promise<Response<CrewPurchaseCategory>> {
    try {
      const crewPurchaseCategory =
        await this.prisma.crewPurchaseCategory.findUnique({
          where: {
            backoffice_setting_id_category_id: {
              backoffice_setting_id,
              category_id,
            },
          },
          include: {
            category: true,
            backoffice_setting: true,
          },
        });
      if (!crewPurchaseCategory) throw new NotFoundException('Card Not Found');

      this.logger.logBusinessEvent(
        `Crew purchase category removed: ${crewPurchaseCategory.category.name}`,
        'CREW_PURCHASE_CATEGORY_REMOVED',
        'CREW_PURCHASE_CATEGORY',
        crewPurchaseCategory.backoffice_setting_id,
        request.user?.username,
        crewPurchaseCategory,
        null,
        {
          backoffice_setting_id,
          category_id,
        },
      );

      try {
        const deletedCrewPurchaseCategory =
          await this.prisma.crewPurchaseCategory.delete({
            where: {
              backoffice_setting_id_category_id: {
                backoffice_setting_id,
                category_id,
              },
            },
          });

        return {
          statusCode: 200,
          message: 'OK',
          data: deletedCrewPurchaseCategory,
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
