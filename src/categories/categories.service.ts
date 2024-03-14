import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Category } from './entities/category.entity';
import Response from 'src/interfaces/response.interface';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectModel(Category.name) private categoryModel: Model<Category>,
  ) {}

  async create(
    createCategoryDto: CreateCategoryDto,
  ): Promise<Response<Category>> {
    try {
      const newCategory = new this.categoryModel({
        id: uuidv4(),
        ...createCategoryDto,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      });

      const category: Category = await newCategory.save();

      return {
        status: 201,
        message: 'CREATED',
        data: category,
      };
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async findAll(): Promise<Response<Category[]>> {
    try {
      const categories: Category[] = await this.categoryModel.find();

      return {
        status: 200,
        message: 'OK',
        data: categories,
      };
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async findOne(id: string): Promise<Response<Category>> {
    try {
      const category: Category = await this.categoryModel.findOne({ id });
      if (!category) throw new NotFoundException('Category Not Found');

      return {
        status: 200,
        message: 'OK',
        data: category,
      };
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async update(
    id: string,
    updateCategoryDto: UpdateCategoryDto,
  ): Promise<Response<Category>> {
    try {
      const category: Category = await this.categoryModel.findOneAndUpdate(
        { id },
        updateCategoryDto,
        { returnDocument: 'after' },
      );
      if (!category) throw new NotFoundException('Category Not Found');

      return {
        status: 200,
        message: 'OK',
        data: category,
      };
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async remove(id: string): Promise<Response<Category>> {
    try {
      const category: Category = await this.categoryModel.findOneAndDelete({
        id,
      });
      if (!category) throw new NotFoundException();

      return {
        status: 200,
        message: 'OK',
        data: category,
      };
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
}
