import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCrewPurchaseCategoryDto } from './dto/create-crew-purchase-category.dto';
import { PrismaService } from 'src/prisma.service';
import { CrewPurchaseCategory } from '@prisma/client';
import Response from 'src/interfaces/response.interface';
import { UpdateCrewPurchaseCategoryDto } from './dto/update-crew-purchase-category.dto';

@Injectable()
export class CrewPurchaseCategoryService {
  constructor(private prisma: PrismaService) {}

  async create(
    createCrewPurchaseCategoryDto: CreateCrewPurchaseCategoryDto,
  ): Promise<Response<CrewPurchaseCategory>> {
    try {
      const crewPurchaseCategory =
        await this.prisma.crewPurchaseCategory.create({
          data: createCrewPurchaseCategoryDto,
        });

      return {
        statusCode: 201,
        message: 'CREATED',
        data: crewPurchaseCategory,
      };
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async findAll(
    updateCrewPurchaseCategory: UpdateCrewPurchaseCategoryDto,
  ): Promise<Response<CrewPurchaseCategory[]>> {
    try {
      const crewPurchaseCategory =
        await this.prisma.crewPurchaseCategory.findMany({
          where: updateCrewPurchaseCategory,
        });

      return {
        statusCode: 200,
        message: 'OK',
        data: crewPurchaseCategory,
      };
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async remove(
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
        });
      if (!crewPurchaseCategory) throw new NotFoundException('Card Not Found');

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
