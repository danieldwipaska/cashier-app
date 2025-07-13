import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateFnbModifierDto } from './dto/create-fnb-modifier.dto';
import Response from 'src/interfaces/response.interface';
import { FnbModifier } from '@prisma/client';
import { PrismaService } from 'src/prisma.service';
import { CustomLoggerService } from 'src/loggers/custom-logger.service';

@Injectable()
export class FnbModifiersService {
  constructor(
    private prisma: PrismaService,
    private readonly logger: CustomLoggerService,
  ) {}

  async create(
    request: any,
    createFnbModifierDto: CreateFnbModifierDto,
  ): Promise<Response<FnbModifier>> {
    try {
      const newFnbModifier = await this.prisma.fnbModifier.create({
        data: createFnbModifierDto,
        include: {
          modifier: true,
          fnb: true,
        },
      });

      this.logger.logBusinessEvent(
        `Fnb Modifier has been set: Fnb ${newFnbModifier.fnb.name} and Modifier ${newFnbModifier.modifier.name}`,
        'FNB_MODIFIER_CREATED',
        'FNB_MODIFIER',
        `Fnb ${newFnbModifier.fnb_id} and Modifier ${newFnbModifier.modifier_id}`,
        request.user?.username,
        null,
        newFnbModifier,
        createFnbModifierDto,
      );

      return {
        statusCode: 201,
        message: 'CREATED',
        data: newFnbModifier,
      };
    } catch (error) {
      this.logger.logError(
        error,
        'FnbModifiersService.create',
        request.user?.username,
        request.requestId,
        createFnbModifierDto,
      );
      throw error;
    }
  }

  async findByFnb(request: any, id: string): Promise<Response<any>> {
    try {
      const fnbModifiers = await this.prisma.fnbModifier.findMany({
        where: {
          fnb_id: id,
        },
        include: {
          modifier: true,
          fnb: true,
        },
      });

      return {
        statusCode: 200,
        message: 'OK',
        data: fnbModifiers,
      };
    } catch (error) {
      this.logger.logError(
        error,
        'FnbModifiersService.findByFnb',
        request.user?.username,
        request.requestId,
        {
          id,
          shop_id: request.shop?.id,
        },
      );
      throw error;
    }
  }

  async findByModifier(request: any, id: string): Promise<Response<any>> {
    try {
      const fnbModifiers = await this.prisma.fnbModifier.findMany({
        where: {
          modifier_id: id,
        },
        include: {
          modifier: true,
          fnb: true,
        },
      });

      return {
        statusCode: 200,
        message: 'OK',
        data: fnbModifiers,
      };
    } catch (error) {
      this.logger.logError(
        error,
        'FnbModifiersService.findByModifier',
        request.user?.username,
        request.requestId,
        {
          id,
          shop_id: request.shop?.id,
        },
      );
      throw error;
    }
  }

  async remove(
    request: any,
    fnb_id: string,
    modifier_id: string,
  ): Promise<Response<FnbModifier>> {
    try {
      const fnbModifier = await this.prisma.fnbModifier.findUnique({
        where: {
          modifier_id_fnb_id: {
            fnb_id,
            modifier_id,
          },
        },
        include: {
          fnb: true,
          modifier: true,
        },
      });
      if (!fnbModifier) throw new NotFoundException('FnbModifier Not Found');

      try {
        const deletedFnbModifier = await this.prisma.fnbModifier.delete({
          where: {
            modifier_id_fnb_id: {
              fnb_id,
              modifier_id,
            },
          },
        });

        this.logger.logBusinessEvent(
          `Fnb Modifier removed: Fnb ${fnbModifier.fnb.name} and Modifier ${fnbModifier.modifier.name}`,
          'FNB_MODIFIER_REMOVED',
          'FNB_MODIFIER',
          `Fnb ${fnbModifier.fnb_id} and Modifier ${fnbModifier.modifier_id}`,
          request.user?.username,
          fnbModifier,
          null,
          {
            fnb_id,
            modifier_id,
            shop_id: request.shop?.id,
          },
        );

        return {
          statusCode: 200,
          message: 'OK',
          data: deletedFnbModifier,
        };
      } catch (error) {
        this.logger.logError(
          error,
          'FnbModifiersService.remove',
          request.user?.username,
          request.requestId,
          {
            fnb_id,
            modifier_id,
            shop_id: request.shop?.id,
          },
        );
        throw error;
      }
    } catch (error) {
      this.logger.logError(
        error,
        'FnbModifiersService.remove',
        request.user?.username,
        request.requestId,
        {
          fnb_id,
          modifier_id,
          shop_id: request.shop?.id,
        },
      );
      throw error;
    }
  }
}
