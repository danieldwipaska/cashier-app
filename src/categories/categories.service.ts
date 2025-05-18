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

@Injectable()
export class CategoriesService {
  constructor(private prisma: PrismaService) {}

  async create(
    request: any,
    createCategoryDto: CreateCategoryDto,
  ): Promise<Response<Category>> {
    try {
      const category = await this.prisma.category.findUnique({
        where: { name: createCategoryDto.name },
      });
      if (category) throw new BadRequestException('Category Already Exists');

      try {
        const category = await this.prisma.category.create({
          data: {
            ...createCategoryDto,
            shop_id: request.shop.id,
          },
        });

        return {
          statusCode: 201,
          message: 'CREATED',
          data: category,
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
      console.log(error);
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
      console.log(error);
      throw error;
    }
  }

  async update(
    request: any,
    id: string,
    updateCategoryDto: UpdateCategoryDto,
  ): Promise<Response<Category>> {
    try {
      const category = await this.prisma.category.update({
        where: {
          id,
          shop_id: request.shop.id,
        },
        data: {
          ...updateCategoryDto,
        },
      });

      return {
        statusCode: 200,
        message: 'OK',
        data: category,
      };
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async remove(request: any, id: string): Promise<Response<Category>> {
    try {
      const category = await this.prisma.category.findUnique({
        where: {
          id,
          shop_id: request.shop.id,
        },
      });
      if (!category) throw new NotFoundException('Category Not Found');

      try {
        const deletedCategory = await this.prisma.category.delete({
          where: { id },
        });

        return {
          statusCode: 200,
          message: 'OK',
          data: deletedCategory,
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
