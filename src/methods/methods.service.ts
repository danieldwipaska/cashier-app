import { Injectable, NotFoundException } from '@nestjs/common';
import { Method, Prisma } from '@prisma/client';
import Response from 'src/interfaces/response.interface';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class MethodsService {
  constructor(private prisma: PrismaService) {}

  async create(data: Prisma.MethodCreateInput): Promise<Response<Method>> {
    try {
      const method = await this.prisma.method.create({
        data,
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

  async findAll(): Promise<Response<Method[]>> {
    try {
      const methods = await this.prisma.method.findMany();
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

  async findOne(id: string): Promise<Response<Method>> {
    try {
      const method = await this.prisma.method.findUnique({
        where: { id },
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

  async update(id: string, data: Prisma.MethodUpdateInput): Promise<Response<Method>> {
    try {
      const method = await this.prisma.method.update({
        where: { id },
        data,
      });

      return {
        statusCode: 200,
        message: 'OK',
        data: method,
      };
    } catch (error) {
      throw error
    }
  }

  async remove(id: string): Promise<Response<Method>> {
    try {
      const method = await this.prisma.method.findUnique({
        where: { id },
      });
      if (!method) throw new NotFoundException('Method Not Found');

      try {
        const deletedMethod = await this.prisma.method.delete({
          where: { id },
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
