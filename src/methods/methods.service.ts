import { Injectable, NotFoundException } from '@nestjs/common';
import { Method } from '@prisma/client';
import Response from 'src/interfaces/response.interface';
import { PrismaService } from 'src/prisma.service';
import { CreateMethodDto } from './dto/create-method.dto';
import { UpdateMethodDto } from './dto/update-method.dto';
import { CustomLoggerService } from 'src/loggers/custom-logger.service';

@Injectable()
export class MethodsService {
  constructor(
    private prisma: PrismaService,
    private readonly logger: CustomLoggerService,
  ) {}

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

      this.logger.logBusinessEvent(
        `New method created: ${method.name}`,
        'METHOD_CREATED',
        'METHOD',
        method.id,
        request.user?.username,
        null,
        method,
        createMethodDto,
      );

      return {
        statusCode: 201,
        message: 'CREATED',
        data: method,
      };
    } catch (error) {
      this.logger.logError(
        error,
        'MethodsService.create',
        request.user?.username,
        request.requestId,
        createMethodDto,
      );
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
      this.logger.logError(
        error,
        'MethodsService.findAll',
        request.user?.username,
        request.requestId,
        { shop_id: request.shop.id },
      );
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
      this.logger.logError(
        error,
        'MethodsService.findOne',
        request.user?.username,
        request.requestId,
        { id, shop_id: request.shop.id },
      );
      throw error;
    }
  }

  async update(
    request: any,
    id: string,
    updateMethodDto: UpdateMethodDto,
  ): Promise<Response<Method>> {
    try {
      const method = await this.prisma.method.findUnique({
        where: {
          id,
          shop_id: request.shop.id,
        },
      });
      if (!method) throw new NotFoundException('Method Not Found');

      const newMethod = await this.prisma.method.update({
        where: {
          id,
          shop_id: request.shop.id,
        },
        data: {
          ...updateMethodDto,
        },
      });

      this.logger.logBusinessEvent(
        `Method updated: ${newMethod.name}`,
        'METHOD_UPDATED',
        'METHOD',
        newMethod.id,
        request.user?.username,
        method,
        newMethod,
        { id, shop_id: request.shop.id, updateMethodDto },
      );

      return {
        statusCode: 200,
        message: 'OK',
        data: method,
      };
    } catch (error) {
      this.logger.logError(
        error,
        'MethodsService.update',
        request.user?.username,
        request.requestId,
        { id, shop_id: request.shop.id, updateMethodDto },
      );
      throw error;
    }
  }

  async remove(request: any, id: string): Promise<Response<Method>> {
    try {
      const deletedMethod = await this.prisma.method.delete({
        where: {
          id,
          shop_id: request.shop.id,
        },
      });

      this.logger.logBusinessEvent(
        `Method deleted: ${deletedMethod.name}`,
        'METHOD_DELETED',
        'METHOD',
        deletedMethod.id,
        request.user?.username,
        deletedMethod,
        null,
        { id, shop_id: request.shop.id },
      );

      return {
        statusCode: 200,
        message: 'OK',
        data: deletedMethod,
      };
    } catch (error) {
      this.logger.logError(
        error,
        'MethodsService.remove',
        request.user?.username,
        request.requestId,
        { id, shop_id: request.shop.id },
      );
      throw error;
    }
  }
}
