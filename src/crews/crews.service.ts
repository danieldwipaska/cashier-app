import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Crew, Prisma } from '@prisma/client';
import Response from '../interfaces/response.interface';
import { PrismaService } from '../prisma.service';
import { UpdateCrewDto } from './dto/update-crew.dto';
import { CreateCrewDto } from './dto/create-crew.dto';
import { CustomLoggerService } from '../loggers/custom-logger.service';

@Injectable()
export class CrewsService {
  constructor(
    private prisma: PrismaService,
    private readonly logger: CustomLoggerService,
  ) {}
  async create(
    request: any,
    createCrewDto: CreateCrewDto,
  ): Promise<Response<Crew>> {
    try {
      const crew = await this.prisma.crew.create({
        data: {
          ...createCrewDto,
          shop_id: request.shop.id,
        },
      });

      this.logger.logBusinessEvent(
        `New crew created: ${crew.name}`,
        'CREW_CREATED',
        'CREW',
        crew.id,
        request.user?.username,
        null,
        crew,
        createCrewDto,
      );

      return {
        statusCode: 201,
        message: 'CREATED',
        data: crew,
      };
    } catch (error) {
      this.logger.logError(
        error,
        'CrewsService.create',
        request.user?.username,
        request.requestId,
        createCrewDto,
      );
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
      this.logger.logError(
        error,
        'CrewsService.findAll',
        request.user?.username,
        request.requestId,
        { shop_id: request.shop.id },
      );
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
      this.logger.logError(
        error,
        'CrewsService.findOne',
        request.user?.username,
        request.requestId,
        { id, shop_id: request.shop.id },
      );
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
      this.logger.logError(
        error,
        'CrewsService.findOneByCode',
        request.user?.username,
        request.requestId,
        { code, shop_id: request.shop.id },
      );
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

        this.logger.logBusinessEvent(
          `Crew updated: ${updatedCrew.name}`,
          'CREW_CREATED',
          'CREW',
          updatedCrew.id,
          request.user?.username,
          crew,
          updatedCrew,
          updateCrewDto,
        );

        return {
          statusCode: 200,
          message: 'OK',
          data: updatedCrew,
        };
      } catch (error) {
        this.logger.logError(
          error,
          'CrewsService.update',
          request.user?.username,
          request.requestId,
          { id, shop_id: request.shop.id, updateCrewDto },
        );
        throw error;
      }
    } catch (error) {
      this.logger.logError(
        error,
        'CrewsService.update',
        request.user?.username,
        request.requestId,
        { id, shop_id: request.shop.id, updateCrewDto },
      );
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

      const reports = await this.prisma.report.findMany({
        where: { crew_id: crew.id },
        select: { id: true },
      });

      try {
        const [, deletedCrew] = await this.prisma.$transaction([
          this.prisma.report.updateMany({
            where: { crew_id: crew.id },
            data: { crew_id: null },
          }),
          this.prisma.crew.delete({
            where: {
              id,
              shop_id: request.shop.id,
            },
          }),
        ]);

        this.logger.logBusinessEvent(
          `Reports updated: ${reports.length} reports moved to null crew`,
          'REPORT_UPDATED',
          'REPORT',
          reports.map((report) => report.id).join(', '),
          request.user?.username,
          reports,
          null,
          { crew_id: id },
        );

        this.logger.logBusinessEvent(
          `Crew deleted: ${crew.name}`,
          'CREW_DELETED',
          'CREW',
          deletedCrew.id,
          request.user?.username,
          deletedCrew,
          null,
          { crew_id: id },
        );

        return {
          statusCode: 200,
          message: 'OK',
          data: deletedCrew,
        };
      } catch (error) {
        this.logger.logError(
          error,
          'CrewsService.remove',
          request.user?.username,
          request.requestId,
        );
        if (
          error instanceof Prisma.PrismaClientKnownRequestError &&
          error.code === 'P2003'
        ) {
          throw new BadRequestException(
            'Crew cannot be deleted because it is still referenced by other data (e.g., reports)',
          );
        }
        throw error;
      }
    } catch (error) {
      throw error;
    }
  }
}
