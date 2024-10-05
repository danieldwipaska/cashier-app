import { Injectable, NotFoundException } from '@nestjs/common';
import { Crew, Prisma } from '@prisma/client';
import Response from 'src/interfaces/response.interface';
import { PrismaService } from 'src/prisma.service';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class CrewsService {
  constructor(
    private prisma: PrismaService,
    private usersService: UsersService,
  ) {}
  async create(
    data: Prisma.CrewCreateInput,
    username: string,
  ): Promise<Response<Crew>> {
    try {
      const user = await this.usersService.findOneByUsername(username);
      if (!user) throw new NotFoundException('User Not Found');

      const crew = await this.prisma.crew.create({
        data: {
          name: data.name,
          position: data.position,
          code: data.code,
          shopId: user.data.shopId,
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

  async findAll(): Promise<Response<Crew[]>> {
    try {
      const crews = await this.prisma.crew.findMany();
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

  async findOne(id: string): Promise<Response<Crew>> {
    try {
      const crew = await this.prisma.crew.findUnique({ where: { id } });
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

  async findOneByCode(code: string): Promise<Response<Crew>> {
    try {
      const crew = await this.prisma.crew.findUnique({ where: { code } });
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
    id: string,
    data: Prisma.CrewUpdateInput,
  ): Promise<Response<Crew>> {
    try {
      const crew = await this.prisma.crew.findUnique({ where: { id } });
      if (!crew) throw new NotFoundException('Crew Not Found');

      try {
        const updatedCrew = await this.prisma.crew.update({
          where: { id },
          data,
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

  async remove(id: string): Promise<Response<Crew>> {
    try {
      const crew = await this.prisma.crew.findUnique({ where: { id } });
      if (!crew) throw new NotFoundException('Crew Not Found');

      try {
        const deletedCrew = await this.prisma.crew.delete({ where: { id } });

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
