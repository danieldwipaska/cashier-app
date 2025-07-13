import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateModifierDto } from './dto/create-modifier.dto';
import { UpdateModifierDto } from './dto/update-modifier.dto';
import { Modifier } from '@prisma/client';
import Response from 'src/interfaces/response.interface';
import { PrismaService } from 'src/prisma.service';
import { CustomLoggerService } from 'src/loggers/custom-logger.service';

@Injectable()
export class ModifiersService {
  constructor(
    private prisma: PrismaService,
    private readonly logger: CustomLoggerService,
  ) {}

  async create(
    request: any,
    createModifierDto: CreateModifierDto,
  ): Promise<Response<Modifier>> {
    try {
      const newModifier = await this.prisma.modifier.create({
        data: {
          ...createModifierDto,
          shop_id: request.shop.id,
        },
      });

      this.logger.logBusinessEvent(
        `New modifier created: ${newModifier.name}`,
        'MODIFIER_CREATED',
        'MODIFIER',
        newModifier.id,
        request.user?.username,
        null,
        newModifier,
        createModifierDto,
      );

      return {
        statusCode: 201,
        message: 'CREATED',
        data: newModifier,
      };
    } catch (error) {
      this.logger.logError(
        error,
        'ModifiersService.create',
        request.user?.username,
        request.requestId,
        createModifierDto,
      );

      throw error;
    }
  }

  async findAll(request: any): Promise<Response<Modifier[]>> {
    try {
      const modifiers = await this.prisma.modifier.findMany({
        where: {
          shop_id: request.shop?.id,
        },
      });

      return {
        statusCode: 200,
        message: 'OK',
        data: modifiers,
      };
    } catch (error) {
      this.logger.logError(
        error,
        'ModifiersService.findAll',
        request.user?.username,
        request.requestId,
        null,
      );

      throw error;
    }
  }

  async findOne(request: any, id: string): Promise<Response<Modifier>> {
    try {
      const modifier = await this.prisma.modifier.findUnique({
        where: {
          id,
          shop_id: request.shop?.id,
        },
      });

      return {
        statusCode: 200,
        message: 'OK',
        data: modifier,
      };
    } catch (error) {
      this.logger.logError(
        error,
        'ModifiersService.findOne',
        request.user?.username,
        request.requestId,
        null,
      );

      throw error;
    }
  }

  async update(
    request: any,
    id: string,
    updateModifierDto: UpdateModifierDto,
  ): Promise<Response<Modifier>> {
    try {
      const modifier = await this.prisma.modifier.findUnique({
        where: {
          id,
          shop_id: request.shop?.id,
        },
      });
      if (!modifier) throw new NotFoundException('Modifier Not Found');

      const updatedModifier = await this.prisma.modifier.update({
        where: {
          id,
          shop_id: request.shop?.id,
        },
        data: updateModifierDto,
      });

      this.logger.logBusinessEvent(
        `Modifier updated: ${updatedModifier.name}`,
        'MODIFIER_UPDATED',
        'MODIFIER',
        updatedModifier.id,
        request.user?.username,
        modifier,
        updatedModifier,
        {
          id,
          updateModifierDto,
        },
      );

      return {
        statusCode: 200,
        message: 'OK',
        data: updatedModifier,
      };
    } catch (error) {
      this.logger.logError(
        error,
        'ModifiersService.update',
        request.user?.username,
        request.requestId,
        updateModifierDto,
      );
    }
  }

  async remove(request: any, id: string): Promise<Response<Modifier>> {
    try {
      const modifier = await this.prisma.modifier.findUnique({
        where: {
          id,
          shop_id: request.shop?.id,
        },
      });
      if (!modifier) throw new NotFoundException('Modifier Not Found');

      try {
        const deletedModifier = await this.prisma.modifier.delete({
          where: { id, shop_id: request.shop?.id },
        });

        this.logger.logBusinessEvent(
          `Modifier removed: ${deletedModifier.name}`,
          'MODIFIER_DELETED',
          'MODIFIER',
          deletedModifier.id,
          request.user?.username,
          modifier,
          deletedModifier,
          {
            id,
            shop_id: request.shop?.id,
          },
        );

        return {
          statusCode: 200,
          message: 'OK',
          data: deletedModifier,
        };
      } catch (error) {
        this.logger.logError(
          error,
          'ModifiersService.remove',
          request.user?.username,
          request.requestId,
          modifier,
        );
      }
    } catch (error) {
      this.logger.logError(
        error,
        'ModifiersService.remove',
        request.user?.username,
        request.requestId,
        { id, shop_id: request.shop?.id },
      );
    }
  }
}
