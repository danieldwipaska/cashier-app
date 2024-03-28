import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateFnbDto } from './dto/create-fnb.dto';
import { UpdateFnbDto } from './dto/update-fnb.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Fnb } from './entities/fnb.entity';
import { Model } from 'mongoose';
import Response from '../interfaces/response.interface';
import { v4 } from 'uuid';

@Injectable()
export class FnbsService {
  constructor(@InjectModel(Fnb.name) private fnbModel: Model<Fnb>) {}

  async create(createFnbDto: CreateFnbDto): Promise<Response<Fnb>> {
    createFnbDto.price = Number(createFnbDto.price);

    const newFnb = new this.fnbModel({
      id: v4(),
      ...createFnbDto,
      availability: true,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });

    try {
      const fnb: Fnb = await newFnb.save();

      return {
        statusCode: 201,
        message: 'CREATED',
        data: fnb,
      };
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async findAll(): Promise<Response<Fnb[]>> {
    try {
      const fnbs: Fnb[] = await this.fnbModel.find().exec();

      return {
        statusCode: 200,
        message: 'OK',
        data: fnbs,
      };
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async findOne(id: string): Promise<Response<Fnb>> {
    try {
      const fnb: Fnb = await this.fnbModel.findOne({ id });
      if (!fnb)
        return {
          statusCode: 404,
          message: 'NOT FOUND',
          data: fnb,
        };

      return {
        statusCode: 200,
        message: 'OK',
        data: fnb,
      };
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async update(id: string, updateFnbDto: UpdateFnbDto): Promise<Response<Fnb>> {
    try {
      const updatedFnb: Fnb = await this.fnbModel.findOneAndUpdate(
        { id },
        updateFnbDto,
        { returnDocument: 'after' },
      );
      if (!updatedFnb) throw new NotFoundException('Fnb Not Found');

      return {
        statusCode: 200,
        message: 'OK',
        data: updatedFnb,
      };
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async remove(id: string): Promise<Response<Fnb>> {
    try {
      const removedFnb: Fnb = await this.fnbModel.findOneAndDelete({ id });
      if (!removedFnb)
        return {
          statusCode: 404,
          message: 'NOT FOUND',
          data: null,
        };

      return {
        statusCode: 200,
        message: 'OK',
        data: removedFnb,
      };
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
}
