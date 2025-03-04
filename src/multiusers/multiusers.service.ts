import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { Prisma, User } from '@prisma/client';
import Response from 'src/interfaces/response.interface';
import { PrismaService } from 'src/prisma.service';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class MultiusersService {
  constructor(
    private prisma: PrismaService,
    private usersService: UsersService,
  ) {}

  async create(
    username: string,
    data: Prisma.UserCreateInput,
  ): Promise<Response<User>> {
    // console.log('test');
    try {
      const user = await this.usersService.findOneByUsername(username);
      if (user.data.role !== 'admin')
        throw new UnauthorizedException('Unauthorized User');

      try {
        const newUser = await this.usersService.create(data);

        return {
          statusCode: 201,
          message: 'CREATED',
          data: newUser.data,
        };
      } catch (error) {
        throw error;
      }
    } catch (error) {
      throw error;
    }
  }

  async findAll(username: string): Promise<Response<User[] | any>> {
    try {
      const user = await this.usersService.findOneByUsername(username);
      if (user.data.role !== 'admin')
        throw new UnauthorizedException('Unauthorized User');

      try {
        const users = await this.usersService.findAll();

        // console.log(users);

        return {
          statusCode: 200,
          message: 'OK',
          data: users.data,
        };
      } catch (error) {
        throw error;
      }
    } catch (error) {
      throw error;
    }
  }

  async findOne(id: string, username: string): Promise<Response<User>> {
    try {
      const user = await this.usersService.findOneByUsername(username);
      if (user.data.role !== 'admin')
        throw new UnauthorizedException('Unauthorized User');

      try {
        const searchedUser = await this.usersService.findOne(id);
        if (!searchedUser.data) throw new NotFoundException('User Not Found');

        return {
          statusCode: 200,
          message: 'OK',
          data: searchedUser.data,
        };
      } catch (error) {
        throw error;
      }
    } catch (error) {
      throw error;
    }
  }

  async findUserConfiguration(username: string): Promise<Response<User>> {
    try {
      const user = await this.usersService.findOneByUsername(username);
      if (!user) throw new NotFoundException('User Not Found');

      return {
        statusCode: 200,
        message: 'OK',
        data: user.data,
      };
    } catch (error) {
      throw error;
    }
  }

  async update(
    id: string,
    data: Prisma.UserUpdateInput,
    username: string,
  ): Promise<Response<User>> {
    try {
      const user = await this.usersService.findOneByUsername(username);
      if (user.data.role !== 'admin')
        throw new UnauthorizedException('Unauthorized User');

      try {
        const updatedUser = await this.usersService.update(id, data);

        return {
          statusCode: 200,
          message: 'OK',
          data: updatedUser.data,
        };
      } catch (error) {
        throw error;
      }
    } catch (error) {
      throw error;
    }
  }

  async remove(id: string, username: string): Promise<Response<User>> {
    try {
      const user = await this.usersService.findOneByUsername(username);
      if (user.data.role !== 'admin')
        throw new UnauthorizedException('Unauthorized User');

      try {
        const deletedUser = await this.usersService.remove(id);

        return {
          statusCode: 200,
          message: 'OK',
          data: deletedUser.data,
        };
      } catch (error) {
        throw error;
      }
    } catch (error) {
      throw error;
    }
  }
}
