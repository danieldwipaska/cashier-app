import { Injectable, NotFoundException } from '@nestjs/common';
import { Method } from '@prisma/client';
import Response from 'src/interfaces/response.interface';
import { PrismaService } from 'src/prisma.service';
import { CreateMethodDto } from './dto/create-method.dto';
import { UpdateMethodDto } from './dto/update-method.dto';

@Injectable()
export class MethodsService {
  constructor(private prisma: PrismaService) {}

  async create(
    request: any,
    createMethodDto: CreateMethodDto,
  ): Promise<Response<Method>> {
    try {
      const method = await this.prisma.method.create({
        data: {
          ...createMethodDto,
          shop_id: request.shop.id,
        },
      });

      return {
        statusCode: 201,
        message: 'CREATED',
        data: method,
      };
    } catch (error) {
      throw error;
    }
  }

  async findAll(request: any): Promise<Response<Method[]>> {
    try {
      const methods = await this.prisma.method.findMany({
        where: {
          shop_id: request.shop.id,
        },
      });
      if (!methods.length) throw new NotFoundException('Method Not Found');

      return {
        statusCode: 200,
        message: 'OK',
        data: methods,
      };
    } catch (error) {
      throw error;
    }
  }

  async findOne(request: any, id: string): Promise<Response<Method>> {
    try {
      const method = await this.prisma.method.findUnique({
        where: {
          id,
          shop_id: request.shop.id,
        },
      });
      if (!method) throw new NotFoundException('Method Not Found');

      return {
        statusCode: 200,
        message: 'OK',
        data: method,
      };
    } catch (error) {
      throw error;
    }
  }

  async update(
    request: any,
    id: string,
    updateMethodDto: UpdateMethodDto,
  ): Promise<Response<Method>> {
    try {
      const method = await this.prisma.method.update({
        where: {
          id,
          shop_id: request.shop.id,
        },
        data: {
          ...updateMethodDto,
        },
      });

      return {
        statusCode: 200,
        message: 'OK',
        data: method,
      };
    } catch (error) {
      throw error;
    }
  }

  async remove(request: any, id: string): Promise<Response<Method>> {
    try {
      const method = await this.prisma.method.findUnique({
        where: {
          id,
          shop_id: request.shop.id,
        },
      });
      if (!method) throw new NotFoundException('Method Not Found');

      try {
        const deletedMethod = await this.prisma.method.delete({
          where: {
            id,
            shop_id: request.shop.id,
          },
        });

        return {
          statusCode: 200,
          message: 'OK',
          data: deletedMethod,
        };
      } catch (error) {
        throw error;
      }
    } catch (error) {
      throw error;
    }
  }
}
