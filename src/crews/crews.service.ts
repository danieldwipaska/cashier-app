import { Injectable, NotFoundException } from '@nestjs/common';
import { Crew } from '@prisma/client';
import Response from 'src/interfaces/response.interface';
import { PrismaService } from 'src/prisma.service';
import { UsersService } from 'src/users/users.service';
import { UpdateCrewDto } from './dto/update-crew.dto';
import { CreateCrewDto } from './dto/create-crew.dto';

@Injectable()
export class CrewsService {
  constructor(
    private prisma: PrismaService,
    private usersService: UsersService,
  ) {}
  async create(
    createCrewDto: CreateCrewDto,
    username: string,
    shop_id: string,
  ): Promise<Response<Crew>> {
    try {
      const user = await this.usersService.findOneByUsername(username);
      if (user.statusCode === 404)
        throw new NotFoundException('User not exist');

      const crew = await this.prisma.crew.create({
        data: {
          ...createCrewDto,
          shop_id,
        },
      });

      return {
        statusCode: 201,
        message: 'CREATED',
        data: crew,
      };
    } catch (error) {
      throw error;
    }
  }

  async findAll(request: any): Promise<Response<Crew[]>> {
    try {
      const crews = await this.prisma.crew.findMany({
        where: {
          shop_id: request.shop.id,
        },
      });
      if (!crews.length) throw new NotFoundException('Crew Not Found');

      return {
        statusCode: 200,
        message: 'OK',
        data: crews,
      };
    } catch (error) {
      throw error;
    }
  }

  async findOne(request: any, id: string): Promise<Response<Crew>> {
    try {
      const crew = await this.prisma.crew.findFirst({
        where: {
          AND: [{ id }, { shop_id: request.shop.id }],
        },
      });
      if (!crew) throw new NotFoundException('Crew Not Found');

      return {
        statusCode: 200,
        message: 'OK',
        data: crew,
      };
    } catch (error) {
      throw error;
    }
  }

  async findOneByCode(request: any, code: string): Promise<Response<Crew>> {
    try {
      const crew = await this.prisma.crew.findUnique({
        where: {
          code,
          shop_id: request.shop.id,
        },
      });
      if (!crew) throw new NotFoundException('Crew Not Found');

      return {
        statusCode: 200,
        message: 'OK',
        data: crew,
      };
    } catch (error) {
      throw error;
    }
  }

  async update(
    request: any,
    id: string,
    updateCrewDto: UpdateCrewDto,
  ): Promise<Response<Crew>> {
    try {
      const crew = await this.prisma.crew.findUnique({ where: { id } });
      if (!crew) throw new NotFoundException('Crew Not Found');

      try {
        const updatedCrew = await this.prisma.crew.update({
          where: {
            id,
            shop_id: request.shop.id,
          },
          data: {
            ...updateCrewDto,
          },
        });

        return {
          statusCode: 200,
          message: 'OK',
          data: updatedCrew,
        };
      } catch (error) {
        throw error;
      }
    } catch (error) {
      throw error;
    }
  }

  async remove(request: any, id: string): Promise<Response<Crew>> {
    try {
      const crew = await this.prisma.crew.findUnique({
        where: {
          id,
          shop_id: request.shop.id,
        },
      });
      if (!crew) throw new NotFoundException('Crew Not Found');

      try {
        const deletedCrew = await this.prisma.crew.delete({
          where: {
            id,
            shop_id: request.shop.id,
          },
        });

        return {
          statusCode: 200,
          message: 'OK',
          data: deletedCrew,
        };
      } catch (error) {
        throw error;
      }
    } catch (error) {
      throw error;
    }
  }
}
