import {
  ExecutionContext,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma, Shop} from '@prisma/client';
import Response from 'src/interfaces/response.interface';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class ShopsService {
  constructor(
    private prisma: PrismaService,
  ) {}
  async create(data: Prisma.ShopCreateInput): Promise<Response<Shop>> {
    try {
      const shop = await this.prisma.shop.create({
        data,
      });

      return {
        statusCode: 201,
        message: 'CREATED',
        data: shop,
      };
    } catch (error) {
      throw error;
    }
  }

  async findAll(): Promise<Response<Shop[]>> {
    try {
      const shops = await this.prisma.shop.findMany();
      if (!shops.length) throw new NotFoundException('Shop Not Found');

      return {
        statusCode: 200,
        message: 'OK',
        data: shops,
      };
    } catch (error) {
      throw error;
    }
  }

  async findOne(id: string): Promise<Response<Shop>> {
    try {
      const shop = await this.prisma.shop.findUnique({ where: { id } });
      if (!shop) throw new NotFoundException('Shop Not Found');

      return {
        statusCode: 200,
        message: 'OK',
        data: shop,
      };
    } catch (error) {
      throw error;
    }
  }

  async update(
    id: string,
    data: Prisma.ShopUpdateInput,
  ): Promise<Response<Shop>> {
    try {
      const shop = await this.prisma.shop.findUnique({ where: { id } });
      if (!shop) throw new NotFoundException('Shop Not Found');

      try {
        const updatedShop = await this.prisma.shop.update({
          where: { id },
          data,
        });

        return {
          statusCode: 200,
          message: 'OK',
          data: updatedShop,
        };
      } catch (error) {
        throw error;
      }
    } catch (error) {
      throw error;
    }
  }

  async remove(id: string): Promise<Response<Shop>> {
    try {
      const shop = await this.prisma.shop.findUnique({ where: { id } });
      if (!shop) throw new NotFoundException('Shop Not Found');

      try {
        const deletedShop = await this.prisma.shop.delete({ where: { id } });

        return {
          statusCode: 200,
          message: 'OK',
          data: deletedShop,
        };
      } catch (error) {
        throw error;
      }
    } catch (error) {
      throw error;
    }
  }
}
