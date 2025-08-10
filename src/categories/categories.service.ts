import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import Response from 'src/interfaces/response.interface';

import { PrismaService } from 'src/prisma.service';
import { Category } from '@prisma/client';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { CustomLoggerService } from 'src/loggers/custom-logger.service';

@Injectable()
export class CategoriesService {
  constructor(
    private prisma: PrismaService,
    private readonly logger: CustomLoggerService,
  ) {}

  async create(
    request: any,
    createCategoryDto: CreateCategoryDto,
  ): Promise<Response<Category>> {
    try {
      const category = await this.prisma.category.findUnique({
        where: {
          shop_id_name: {
            shop_id: request.shop.id,
            name: createCategoryDto.name,
          },
        },
      });
      if (category) throw new BadRequestException('Category Already Exists');

      try {
        const newCategory = await this.prisma.category.create({
          data: {
            ...createCategoryDto,
            shop_id: request.shop.id,
          },
        });

        this.logger.logBusinessEvent(
          `New category created: ${newCategory.name}`,
          'CATEGORY_CREATED',
          'CATEGORY',
          newCategory.id,
          request.user?.username,
          null,
          newCategory,
          createCategoryDto,
        );

        return {
          statusCode: 201,
          message: 'CREATED',
          data: category,
        };
      } catch (error) {
        this.logger.logError(
          error,
          'CategoriesService.create',
          request.user?.username,
          request.requestId,
          {
            category,
            createCategoryDto,
          },
        );
      }
    } catch (error) {
      this.logger.logError(
        error,
        'CategoriesService.create',
        request.user?.username,
        request.requestId,
        {
          createCategoryDto,
        },
      );
    }
  }

  async findAll(request: any): Promise<Response<Category[]>> {
    try {
      const categories = await this.prisma.category.findMany({
        where: {
          shop_id: request.shop.id,
        },
        include: {
          fnbs: true,
        },
      });

      return {
        statusCode: 200,
        message: 'OK',
        data: categories,
      };
    } catch (error) {
      this.logger.logError(
        error,
        'CategoriesService.findAll',
        request.user?.username,
        request.requestId,
        {
          shop_id: request.shop?.id,
        },
      );
      throw error;
    }
  }

  async findOne(request: any, id: string): Promise<Response<Category>> {
    try {
      const category = await this.prisma.category.findUnique({
        where: {
          id,
          shop_id: request.shop.id,
        },
      });
      if (!category) throw new NotFoundException('Category Not Found');

      return {
        statusCode: 200,
        message: 'OK',
        data: category,
      };
    } catch (error) {
      this.logger.logError(
        error,
        'CategoriesService.findOne',
        request.user?.username,
        request.requestId,
        {
          id,
          shop_id: request.shop?.id,
        },
      );
      throw error;
    }
  }

  async update(
    request: any,
    id: string,
    updateCategoryDto: UpdateCategoryDto,
  ): Promise<Response<Category>> {
    try {
      const category = await this.prisma.category.findUnique({
        where: {
          id,
          shop_id: request.shop.id,
        },
      });
      if (!category) throw new NotFoundException('Category Not Found');

      const updatedCategory = await this.prisma.category.update({
        where: {
          id,
          shop_id: request.shop.id,
        },
        data: {
          ...updateCategoryDto,
        },
      });

      this.logger.logBusinessEvent(
        `Category updated: ${updatedCategory.name}`,
        'CATEGORY_UPDATED',
        'CATEGORY',
        updatedCategory.id,
        request.user?.username,
        category,
        updatedCategory,
        updateCategoryDto,
      );

      return {
        statusCode: 200,
        message: 'OK',
        data: updatedCategory,
      };
    } catch (error) {
      this.logger.logError(
        error,
        'CategoriesService.update',
        request.user?.username,
        request.requestId,
        updateCategoryDto,
      );
    }
  }

  async remove(request: any, id: string): Promise<Response<Category>> {
    try {
      const category = await this.prisma.category.findUnique({
        where: {
          id,
          shop_id: request.shop?.id,
        },
      });
      if (!category) throw new NotFoundException('Category Not Found');

      try {
        const deletedCategory = await this.prisma.category.delete({
          where: { id, shop_id: request.shop.id },
        });

        this.logger.logBusinessEvent(
          `Category deleted: ${deletedCategory.name}`,
          'CATEGORY_DELETED',
          'CATEGORY',
          deletedCategory.id,
          request.user?.username,
          category,
          deletedCategory,
          {
            id,
            shop_id: request.shop?.id,
          },
        );

        return {
          statusCode: 200,
          message: 'OK',
          data: deletedCategory,
        };
      } catch (error) {
        this.logger.logError(
          error,
          'CategoriesService.remove',
          request.user?.username,
          request.requestId,
          {
            id,
          },
        );
      }
    } catch (error) {
      this.logger.logError(
        error,
        'CategoriesService.remove',
        request.user?.username,
        request.requestId,
        {
          id,
        },
      );
    }
  }
}
