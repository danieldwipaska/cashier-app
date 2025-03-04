import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import Response from 'src/interfaces/response.interface';
import * as bcrypt from 'bcrypt';
import { PrismaService } from 'src/prisma.service';
import { Prisma, User } from '@prisma/client';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async create(data: Prisma.UserCreateInput): Promise<Response<User>> {
    try {
      const user = await this.prisma.user.findUnique({
        where: { username: data.username },
      });
      if (user) throw new BadRequestException('Username Already Exists');

      const salt = await bcrypt.genSalt();
      data.password = await bcrypt.hash(data.password, salt);

      try {
        const newUser = await this.prisma.user.create({
          data,
        });

        return {
          statusCode: 201,
          message: 'CREATED',
          data: newUser,
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

  async findAll(user?: any): Promise<Response<User[]>> {
    const shopId = user.shops[0].shop;
    if (shopId) {
      try {
        const allUsers = await this.prisma.user.findMany({
          where: {
            shops: {
              some: {
                shop: shopId,
              },
            },
          },
          include: {
            shops: {
              include: { shop: true },
            },
          },
        });
        if (!allUsers.length) throw new NotFoundException('User Not Found');

        const users = allUsers.filter((user) => user.role !== 'admin');

        users.forEach((user) => delete user.password);

        return {
          statusCode: 201,
          message: 'CREATED',
          data: users,
        };
      } catch (error) {
        console.log(error);
        throw error;
      }
    } else {
      try {
        const users = await this.prisma.user.findMany();
        if (!users.length) throw new NotFoundException('User Not Found');

        users.forEach((user) => delete user.password);

        return {
          statusCode: 201,
          message: 'CREATED',
          data: users,
        };
      } catch (error) {
        console.log(error);
        throw error;
      }
    }
  }

  async findOne(id: string): Promise<Response<User>> {
    try {
      const user = await this.prisma.user.findUnique({
        where: { id },
        include: {
          shops: {
            include: { shop: true },
          },
        },
      });

      if (user) {
        delete user.password;
      }

      return {
        statusCode: 200,
        message: 'OK',
        data: user,
      };
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async findOneByUsername(username: string): Promise<Response<User>> {
    try {
      const user = await this.prisma.user.findUnique({
        where: { username },
        include: {
          shops: {
            include: { shop: true },
          },
        },
      });

      return {
        statusCode: 200,
        message: 'OK',
        data: user,
      };
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async update(
    id: string,
    data: Prisma.UserUpdateInput,
  ): Promise<Response<User>> {
    try {
      const user = await this.prisma.user.update({
        where: { id },
        data,
      });
      if (!user) throw new NotFoundException('User Not Found');

      return {
        statusCode: 200,
        message: 'OK',
      };
    } catch (error) {
      throw error;
    }
  }

  async remove(id: string): Promise<Response<User>> {
    try {
      const user = await this.prisma.user.findUnique({ where: { id } });
      if (!user) throw new NotFoundException('User Not Found');

      try {
        const deletedUser = await this.prisma.user.delete({ where: { id } });

        return {
          statusCode: 200,
          message: 'OK',
          data: deletedUser,
        };
      } catch (error) {
        throw error;
      }
    } catch (error) {
      throw error;
    }
  }
}
