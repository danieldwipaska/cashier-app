import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserOnShopDto } from './dto/create-user-on-shop.dto';
import { UpdateUserOnShopDto } from './dto/update-user-on-shop.dto';
import { UsersOnShops } from '@prisma/client';
import { PrismaService } from 'src/prisma.service';
import Response from 'src/interfaces/response.interface';

@Injectable()
export class UserOnShopsService {
  constructor(private prisma: PrismaService) {}

  async create(
    createUserOnShopDto: CreateUserOnShopDto,
  ): Promise<Response<UsersOnShops>> {
    try {
      const userOnShop = await this.prisma.usersOnShops.create({
        data: createUserOnShopDto,
      });

      return {
        statusCode: 201,
        message: 'CREATED',
        data: userOnShop,
      };
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async findAll(): Promise<Response<UsersOnShops[]>> {
    try {
      const userOnShop = await this.prisma.usersOnShops.findMany();

      return {
        statusCode: 200,
        message: 'OK',
        data: userOnShop,
      };
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async update(
    shop_id: string,
    user_id: string,
    updateUserOnShopDto: UpdateUserOnShopDto,
  ): Promise<Response<UsersOnShops>> {
    try {
      const userOnShop = await this.prisma.usersOnShops.update({
        where: {
          shop_id_user_id: { user_id, shop_id },
        },
        data: updateUserOnShopDto,
      });

      return {
        statusCode: 200,
        message: 'OK',
        data: userOnShop,
      };
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async removeMany(
    updateUserOnShopDto: UpdateUserOnShopDto,
  ): Promise<Response<UsersOnShops[]>> {
    try {
      await this.prisma.usersOnShops.deleteMany({
        where: updateUserOnShopDto,
      });

      return {
        statusCode: 200,
        message: 'OK',
        data: null,
      };
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async remove(
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

        return {
          statusCode: 200,
          message: 'OK',
          data: deletedUserOnShop,
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
