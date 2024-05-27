import { Injectable, NotFoundException } from '@nestjs/common';
import Response from '../interfaces/response.interface';
import { v4 } from 'uuid';
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

  async findAll(): Promise<Response<Fnbs[]>> {
    try {
      const fnbs = await this.prisma.fnbs.findMany({
        include: { category: true },
        orderBy: {
          created_at: 'asc',
        },
      });

      return {
        statusCode: 200,
        message: 'OK',
        data: fnbs,
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
      console.log(id);
      console.log(data);
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
