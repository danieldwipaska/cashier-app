import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import Response from 'src/interfaces/response.interface';
import { User } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcrypt';

import { ExceptionsHandler } from '@nestjs/core/exceptions/exceptions-handler';
import { CreateCategoryDto } from 'src/categories/dto/create-category.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async register(username: string, password: string): Promise<Response<User>> {
    try {
      const registerUser: Response<User> = await this.usersService.create({
        username,
        password,
      });
      if (!registerUser) throw new BadRequestException('Bad Request');

      return registerUser;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async validateUser(
    username: string,
    password: string,
  ): Promise<Response<User>> {
    try {
      const user: Response<User> =
        await this.usersService.findOneByUsername(username);
      if (!user.data) throw new NotFoundException('User Not Found');

      const isMatch = await bcrypt.compare(password, user.data.password);
      if (!isMatch) throw new UnauthorizedException('Wrong Password');

      const payload = { sub: user.data.id, username: user.data.username };
      const accessToken = await this.jwtService.signAsync(payload);

      delete user.data.password;

      return {
        ...user,
        accessToken,
      };
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  verifyToken() {
    return {
      statusCode: 200,
      message: 'OK',
    };
  }
}
