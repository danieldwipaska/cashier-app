import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserOnShopDto } from './dto/create-user-on-shop.dto';
import { UpdateUserOnShopDto } from './dto/update-user-on-shop.dto';
import { UsersOnShops } from '@prisma/client';
import { PrismaService } from 'src/prisma.service';
import Response from 'src/interfaces/response.interface';
import { CustomLoggerService } from 'src/loggers/custom-logger.service';

@Injectable()
export class UserOnShopsService {
  constructor(
    private prisma: PrismaService,
    private readonly logger: CustomLoggerService,
  ) {}

  async create(
    request: any,
    createUserOnShopDto: CreateUserOnShopDto,
  ): Promise<Response<UsersOnShops>> {
    try {
      const userOnShop = await this.prisma.usersOnShops.create({
        data: createUserOnShopDto,
      });

      this.logger.logBusinessEvent(
        `A User and A shop associated: ${userOnShop.user_id} on shop ${userOnShop.shop_id}`,
        'USER_ON_SHOP_CREATED',
        'USER_ON_SHOP',
        `${userOnShop.shop_id}_${userOnShop.user_id}`,
        request.user?.username,
        null,
        userOnShop,
        createUserOnShopDto,
      );

      return {
        statusCode: 201,
        message: 'CREATED',
        data: userOnShop,
      };
    } catch (error) {
      this.logger.logError(
        error,
        'UserOnShopsService.create',
        request.user?.username,
        request.requestId,
        createUserOnShopDto,
      );
      throw error;
    }
  }

  async findAll(request: any): Promise<Response<UsersOnShops[]>> {
    try {
      const userOnShop = await this.prisma.usersOnShops.findMany();

      return {
        statusCode: 200,
        message: 'OK',
        data: userOnShop,
      };
    } catch (error) {
      this.logger.logError(
        error,
        'UserOnShopsService.findAll',
        request.user?.username,
        request.requestId,
      );
      throw error;
    }
  }

  async update(
    request: any,
    shop_id: string,
    user_id: string,
    updateUserOnShopDto: UpdateUserOnShopDto,
  ): Promise<Response<UsersOnShops>> {
    try {
      const userOnShop = await this.prisma.usersOnShops.findUnique({
        where: { shop_id_user_id: { user_id, shop_id } },
      });
      if (!userOnShop) {
        throw new NotFoundException('User on shop not found');
      }

      const updatedUserOnShop = await this.prisma.usersOnShops.update({
        where: {
          shop_id_user_id: { user_id, shop_id },
        },
        data: updateUserOnShopDto,
      });

      this.logger.logBusinessEvent(
        `User on shop updated: ${userOnShop.user_id} on shop ${userOnShop.shop_id}`,
        'USER_ON_SHOP_UPDATED',
        'USER_ON_SHOP',
        `${userOnShop.shop_id}_${userOnShop.user_id}`,
        request.user?.username,
        userOnShop,
        updatedUserOnShop,
        updateUserOnShopDto,
      );

      return {
        statusCode: 200,
        message: 'OK',
        data: userOnShop,
      };
    } catch (error) {
      this.logger.logError(error, 'UserOnShopsService.update', null, null, {
        shop_id,
        user_id,
        updateUserOnShopDto,
      });
      throw error;
    }
  }

  async removeMany(
    request: any,
    updateUserOnShopDto: UpdateUserOnShopDto,
  ): Promise<Response<UsersOnShops[]>> {
    try {
      const userOnShops = await this.prisma.usersOnShops.findMany({
        where: updateUserOnShopDto,
      });

      await this.prisma.usersOnShops.deleteMany({
        where: updateUserOnShopDto,
      });

      this.logger.logBusinessEvent(
        `Users on shops removed: ${userOnShops.length} users on shops`,
        'USERS_ON_SHOPS_REMOVED',
        'USERS_ON_SHOPS',
        null,
        request.user?.username,
        userOnShops,
        null,
        updateUserOnShopDto,
      );

      return {
        statusCode: 200,
        message: 'OK',
        data: null,
      };
    } catch (error) {
      this.logger.logError(
        error,
        'UserOnShopsService.removeMany',
        request.user?.username,
        request.requestId,
        updateUserOnShopDto,
      );
      throw error;
    }
  }

  async remove(
    request: any,
    user_id: string,
    shop_id: string,
  ): Promise<Response<UsersOnShops>> {
    try {
      const userOnShop = await this.prisma.usersOnShops.findUnique({
        where: { shop_id_user_id: { user_id, shop_id } },
      });
      if (!userOnShop) throw new NotFoundException('Card Not Found');

      try {
        const deletedUserOnShop = await this.prisma.usersOnShops.delete({
          where: { shop_id_user_id: { user_id, shop_id } },
        });

        this.logger.logBusinessEvent(
          `User on shop removed: ${deletedUserOnShop.user_id} on shop ${deletedUserOnShop.shop_id}`,
          'USER_ON_SHOP_REMOVED',
          'USER_ON_SHOP',
          `${deletedUserOnShop.shop_id}_${deletedUserOnShop.user_id}`,
          request.user?.username,
          userOnShop,
          deletedUserOnShop,
          null,
        );

        return {
          statusCode: 200,
          message: 'OK',
          data: deletedUserOnShop,
        };
      } catch (error) {
        this.logger.logError(
          error,
          'UserOnShopsService.remove',
          request.user?.username,
          request.requestId,
          { user_id, shop_id },
        );
        throw error;
      }
    } catch (error) {
      this.logger.logError(
        error,
        'UserOnShopsService.remove',
        request.user?.username,
        request.requestId,
        { user_id, shop_id },
      );
      throw error;
    }
  }
}
