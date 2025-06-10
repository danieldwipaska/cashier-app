import { Injectable, NotFoundException } from '@nestjs/common';
import Response from '../interfaces/response.interface';
import { PrismaService } from 'src/prisma.service';
import { Fnbs, Prisma } from '@prisma/client';
import { PageMetaData } from 'src/interfaces/pagination.interface';
import { countSkip, paginate } from 'src/utils/pagination.util';
import { CreateFnbDto } from './dto/create-fnb.dto';
import { CustomLoggerService } from 'src/loggers/custom-logger.service';

@Injectable()
export class FnbsService {
  constructor(
    private prisma: PrismaService,
    private readonly logger: CustomLoggerService,
  ) {}

  async create(request: any, data: CreateFnbDto): Promise<Response<Fnbs>> {
    try {
      const newFnb = await this.prisma.fnbs.create({
        data: {
          ...data,
          shop_id: request.shop.id,
        },
        include: {
          category: true,
        },
      });

      this.logger.logBusinessEvent(
        `New product created: ${newFnb.name}`,
        'PRODUCT_CREATED',
        'PRODUCT',
        newFnb.id,
        request.user?.username,
        null,
        {
          ...data,
          shop_id: request.shop.id,
        },
      );

      return {
        statusCode: 201,
        message: 'OK',
        data: newFnb,
      };
    } catch (error) {
      this.logger.logError(
        error,
        'FnbsService.create',
        request.user?.username,
        request.requestId,
        data,
      );
    }
  }

  async findAll(
    request: any,
    page?: number,
    pagination?: boolean,
  ): Promise<Response<Fnbs[]>> {
    let take: number | undefined;
    let skip: number | undefined;

    try {
      if (pagination === false) {
        take = undefined;
        skip = undefined;
      } else {
        take = 15;
        skip = countSkip(take, page);
      }

      // eslint-disable-next-line prefer-const
      const [fnbs, totalFnbs] = await Promise.all([
        this.prisma.fnbs.findMany({
          where: {
            shop_id: request.shop.id,
          },
          orderBy: {
            name: 'asc',
          },
          include: { category: true },
          take,
          skip: skip,
        }),
        this.prisma.fnbs.count(),
      ]);
      if (!fnbs) throw new NotFoundException('Fnbs Not Found');

      const pageMetaData: PageMetaData = paginate(page, take, totalFnbs);

      return {
        statusCode: 200,
        message: 'OK',
        data: fnbs,
        pageMetaData,
      };
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async findOne(request: any, id: string): Promise<Response<Fnbs>> {
    try {
      const fnb = await this.prisma.fnbs.findUnique({
        where: {
          id,
          shop_id: request.shop.id,
        },
        include: { category: true },
      });
      if (!fnb) throw new NotFoundException(`Fnb not found`);

      return {
        statusCode: 200,
        message: 'OK',
        data: fnb,
      };
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async update(
    request: any,
    id: string,
    data: Prisma.FnbsUpdateInput,
  ): Promise<Response<Fnbs>> {
    try {
      const fnb = await this.prisma.fnbs.findUnique({
        where: {
          id,
          shop_id: request.shop.id,
        },
        include: {
          category: true,
        },
      });
      if (!fnb) throw new NotFoundException('Fnb Not Found');

      const updatedFnb = await this.prisma.fnbs.update({
        where: {
          id,
          shop_id: request.shop.id,
        },
        include: { category: true },
        data,
      });

      this.logger.logBusinessEvent(
        `Product updated: ${updatedFnb.name}`,
        'PRODUCT_UPDATED',
        'PRODUCT',
        updatedFnb.id,
        request.user?.username,
        fnb,
        updatedFnb,
      );

      return {
        statusCode: 200,
        message: 'OK',
        data: updatedFnb,
      };
    } catch (error) {
      this.logger.logError(
        error,
        'FnbsService.update',
        request.user?.username,
        request.requestId,
        data,
      );
    }
  }

  async remove(request: any, id: string): Promise<Response<Fnbs>> {
    try {
      const fnb = await this.prisma.fnbs.findUnique({
        where: {
          id,
          shop_id: request.shop.id,
        },
      });
      if (!fnb) throw new NotFoundException('Fnb Not Found');

      try {
        const deletedFnb = await this.prisma.fnbs.delete({ where: { id } });

        this.logger.logBusinessEvent(
          `Product removed: ${deletedFnb.name}`,
          'PRODUCT_DELETED',
          'PRODUCT',
          deletedFnb.id,
          request.user?.username,
          fnb,
          deletedFnb,
        );

        return {
          statusCode: 200,
          message: 'OK',
          data: deletedFnb,
        };
      } catch (error) {
        this.logger.logError(
          error,
          'FnbsService.remove',
          request.user?.username,
          request.requestId,
          fnb,
        );
      }
    } catch (error) {
      this.logger.logError(
        error,
        'FnbsService.remove',
        request.user?.username,
        request.requestId,
        {
          id,
        },
      );
    }
  }
}
