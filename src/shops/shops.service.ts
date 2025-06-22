import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma, Shop } from '@prisma/client';
import Response from 'src/interfaces/response.interface';
import { CustomLoggerService } from 'src/loggers/custom-logger.service';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class ShopsService {
  constructor(
    private prisma: PrismaService,
    private readonly logger: CustomLoggerService,
  ) {}
  async create(
    request: any,
    data: Prisma.ShopCreateInput,
  ): Promise<Response<Shop>> {
    try {
      const shop = await this.prisma.shop.create({
        data,
      });

      this.logger.logBusinessEvent(
        `New shop created: ${shop.name}`,
        'SHOP_CREATED',
        'SHOP',
        shop.id,
        request.user?.username,
        null,
        shop,
        data,
      );

      return {
        statusCode: 201,
        message: 'CREATED',
        data: shop,
      };
    } catch (error) {
      this.logger.logError(
        error,
        'ShopsService.create',
        request.user?.username,
        request.requestId,
        data,
      );
      throw error;
    }
  }

  async findAll(request: any): Promise<Response<Shop[]>> {
    try {
      const shops = await this.prisma.shop.findMany();
      if (!shops.length) throw new NotFoundException('Shop Not Found');

      return {
        statusCode: 200,
        message: 'OK',
        data: shops,
      };
    } catch (error) {
      this.logger.logError(
        error,
        'ShopsService.findAll',
        request.user?.username,
        request.requestId,
      );
      throw error;
    }
  }

  async findOne(request: any, id: string): Promise<Response<Shop>> {
    try {
      const shop = await this.prisma.shop.findUnique({ where: { id } });
      if (!shop) throw new NotFoundException('Shop Not Found');

      return {
        statusCode: 200,
        message: 'OK',
        data: shop,
      };
    } catch (error) {
      this.logger.logError(
        error,
        'ShopsService.findOne',
        request.user?.username,
        request.requestId,
        { id },
      );
      throw error;
    }
  }

  async findOneByCode(code: string): Promise<Response<Shop>> {
    try {
      const shop = await this.prisma.shop.findUnique({ where: { code } });
      if (!shop) throw new NotFoundException('Shop Not Found');

      return {
        statusCode: 200,
        message: 'OK',
        data: shop,
      };
    } catch (error) {
      this.logger.logError(error, 'ShopsService.findOneByCode', null, null, {
        code,
      });
      throw error;
    }
  }

  async update(
    request: any,
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

        this.logger.logBusinessEvent(
          `Shop updated: ${updatedShop.name}`,
          'SHOP_UPDATED',
          'SHOP',
          updatedShop.id,
          request.user?.username,
          shop,
          updatedShop,
          { id, data },
        );

        return {
          statusCode: 200,
          message: 'OK',
          data: updatedShop,
        };
      } catch (error) {
        this.logger.logError(
          error,
          'ShopsService.update',
          request.user?.username,
          request.requestId,
          { id, data },
        );
        throw error;
      }
    } catch (error) {
      this.logger.logError(
        error,
        'ShopsService.update',
        request.user?.username,
        request.requestId,
        { id, data },
      );
      throw error;
    }
  }

  async remove(request: any, id: string): Promise<Response<Shop>> {
    try {
      const shop = await this.prisma.shop.findUnique({ where: { id } });
      if (!shop) throw new NotFoundException('Shop Not Found');

      try {
        const deletedShop = await this.prisma.shop.delete({ where: { id } });

        this.logger.logBusinessEvent(
          `Shop deleted: ${deletedShop.name}`,
          'SHOP_DELETED',
          'SHOP',
          deletedShop.id,
          request.user?.username,
          shop,
          deletedShop,
          { id },
        );

        return {
          statusCode: 200,
          message: 'OK',
          data: deletedShop,
        };
      } catch (error) {
        this.logger.logError(
          error,
          'ShopsService.remove',
          request.user?.username,
          request.requestId,
          { id },
        );
        throw error;
      }
    } catch (error) {
      this.logger.logError(
        error,
        'ShopsService.remove',
        request.user?.username,
        request.requestId,
        { id },
      );
      throw error;
    }
  }
}
