import { Injectable, NotFoundException } from '@nestjs/common';
import Response from '../interfaces/response.interface';
import { PrismaService } from 'src/prisma.service';
import { Fnbs, Prisma } from '@prisma/client';

@Injectable()
export class FnbsService {
  constructor(private prisma: PrismaService) {}

  async create(data: Prisma.FnbsCreateInput): Promise<Response<Fnbs>> {
    try {
      const fnb = await this.prisma.fnbs.create({
        data,
        include: {
          category: true,
        },
      });

      return {
        statusCode: 201,
        message: 'OK',
        data: fnb,
      };
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async findAll(page?: number): Promise<Response<Fnbs[]>> {
    const take = 15;
    const skip = page ? (page - 1) * take : 0;

    try {
      // eslint-disable-next-line prefer-const
      let [fnbs, totalFnbs] = await Promise.all([
        this.prisma.fnbs.findMany({
          orderBy: {
            name: 'asc',
          },
          include: { category: true },
          take,
          skip: skip || 0,
        }),
        this.prisma.fnbs.count(),
      ]);

      const totalPage = Math.ceil(totalFnbs / take);
      const currentPage = page || 1;
      const nextPage = currentPage < totalPage ? currentPage + 1 : null;
      const prevPage = currentPage > 1 ? currentPage - 1 : null;
      const hasNextPage = currentPage < totalPage;
      const hasPrevPage = currentPage > 1;

      return {
        statusCode: 200,
        message: 'OK',
        data: fnbs,
        pageMetaData: {
          currentPage,
          perPage: take,
          totalItems: totalFnbs,
          totalPages: totalPage,
          nextPage,
          prevPage,
          hasNextPage,
          hasPrevPage,
        },
      };
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async findOne(id: string): Promise<Response<Fnbs>> {
    try {
      const fnb = await this.prisma.fnbs.findUnique({
        where: { id },
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
    id: string,
    data: Prisma.FnbsUpdateInput,
  ): Promise<Response<Fnbs>> {
    try {
      const fnb = await this.prisma.fnbs.update({
        where: { id },
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

  async remove(id: string): Promise<Response<Fnbs>> {
    try {
      const fnb = await this.prisma.fnbs.findUnique({
        where: { id },
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
