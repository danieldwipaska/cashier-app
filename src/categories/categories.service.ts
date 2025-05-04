import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import Response from 'src/interfaces/response.interface';

import { PrismaService } from 'src/prisma.service';
import { Category, Prisma } from '@prisma/client';

@Injectable()
export class CategoriesService {
  constructor(private prisma: PrismaService) {}

  async create(data: Prisma.CategoryCreateInput): Promise<Response<Category>> {
    try {
      const category = await this.prisma.category.findUnique({
        where: { name: data.name },
      });
      if (category) throw new BadRequestException('Category Already Exists');

      try {
        const category = await this.prisma.category.create({
          data,
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

  async findAll(): Promise<Response<Category[]>> {
    try {
      const categories = await this.prisma.category.findMany({
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

  async findOne(id: string): Promise<Response<Category>> {
    try {
      const category = await this.prisma.category.findUnique({ where: { id } });
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
    id: string,
    data: Prisma.CategoryUpdateInput,
  ): Promise<Response<Category>> {
    try {
      const category = await this.prisma.category.update({
        where: { id },
        data,
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

  async remove(id: string): Promise<Response<Category>> {
    try {
      const category = await this.prisma.category.findUnique({ where: { id } });
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
