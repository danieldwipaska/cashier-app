import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './entities/user.entity';
import { Model } from 'mongoose';
import Response from 'src/interfaces/response.interface';
import { v4 } from 'uuid';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async create(createUserDto: CreateUserDto): Promise<Response<User>> {
    try {
      const foundUser: Response<User> = await this.findOneByUsername(
        createUserDto.username,
      );
      if (foundUser.data)
        throw new BadRequestException('Username Already Exists');

      const salt = await bcrypt.genSalt();
      const hash = await bcrypt.hash(createUserDto.password, salt);

      const newUser = new this.userModel({
        id: v4(),
        ...createUserDto,
        password: hash,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      });

      const user: User = await newUser.save();

      return {
        statusCode: 201,
        message: 'CREATED',
        data: user,
      };
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async findAll(): Promise<User[]> {
    try {
      const users: User[] = await this.userModel.find();

      return users;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async findOne(id: string): Promise<Response<User>> {
    try {
      const user: User = await this.userModel.findOne({ id });
      if (!user) throw new NotFoundException('User Not Found');

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
      const user: User = await this.userModel.findOne({ username });

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

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
