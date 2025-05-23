import { Injectable, NotFoundException } from '@nestjs/common';
import Response from '../interfaces/response.interface';
import { PrismaService } from 'src/prisma.service';
import { Fnbs, Prisma } from '@prisma/client';
import { PageMetaData } from 'src/interfaces/pagination.interface';
import { countSkip, paginate } from 'src/utils/pagination.util';
import { CreateFnbDto } from './dto/create-fnb.dto';

@Injectable()
export class FnbsService {
  constructor(private prisma: PrismaService) {}

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

      return {
        statusCode: 201,
        message: 'OK',
        data: newFnb,
      };
    } catch (error) {
      console.log(error);
      throw error;
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
      const fnb = await this.prisma.fnbs.update({
        where: {
          id,
          shop_id: request.shop.id,
        },
        include: { category: true },
        data,
      });
      if (!fnb) throw new NotFoundException('Fnb Not Found');

      return {
        statusCode: 200,
        message: 'OK',
        data: fnb,
      };
    } catch (error) {
      console.error(error);
      throw error;
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

        return {
          statusCode: 200,
          message: 'OK',
          data: deletedFnb,
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
