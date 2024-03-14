import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateFnbDto } from './dto/create-fnb.dto';
import { UpdateFnbDto } from './dto/update-fnb.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Fnb } from './entities/fnb.entity';
import { Model } from 'mongoose';
import Response from '../interfaces/response.interface';

@Injectable()
export class FnbsService {
  constructor(@InjectModel(Fnb.name) private fnbModel: Model<Fnb>) {}

  async create(createFnbDto: CreateFnbDto): Promise<Response<Fnb>> {
    createFnbDto.price = Number(createFnbDto.price);

    try {
      const fnbs: Fnb[] = (await this.findAll()).data;

      const newFnb = new this.fnbModel({
        id: fnbs.length + 1,
        ...createFnbDto,
        availability: true,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      });

      try {
        const fnb: Fnb = await newFnb.save();

        return {
          status: 201,
          message: 'CREATED',
          data: fnb,
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

  async findAll(): Promise<Response<Fnb[]>> {
    try {
      const fnbs: Fnb[] = await this.fnbModel.find().exec();

      return {
        status: 200,
        message: 'OK',
        data: fnbs,
      };
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async findOne(id: number): Promise<Response<Fnb>> {
    try {
      const fnb: Fnb = await this.fnbModel.findOne({ id });
      if (!fnb)
        return {
          status: 404,
          message: 'NOT FOUND',
          data: fnb,
        };

      return {
        status: 200,
        message: 'OK',
        data: fnb,
      };
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async update(id: number, updateFnbDto: UpdateFnbDto): Promise<Response<Fnb>> {
    try {
      const updatedFnb: Fnb = await this.fnbModel.findOneAndUpdate(
        { id },
        updateFnbDto,
        { returnDocument: 'after' },
      );
      if (!updatedFnb) throw new NotFoundException('Fnb Not Found');

      return {
        status: 200,
        message: 'OK',
        data: updatedFnb,
      };
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async remove(id: number): Promise<Response<Fnb>> {
    try {
      const removedFnb: Fnb = await this.fnbModel.findOneAndDelete({ id });
      if (!removedFnb)
        return {
          status: 404,
          message: 'NOT FOUND',
          data: null,
        };

      return {
        status: 200,
        message: 'OK',
        data: removedFnb,
      };
    } catch (error) {
      console.log(error);
      throw error;
    }
    return;
  }
}
