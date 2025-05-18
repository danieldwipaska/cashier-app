import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import Response from 'src/interfaces/response.interface';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcrypt';
import { Prisma, Shop, User } from '@prisma/client';
import { ShopsService } from 'src/shops/shops.service';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private shopsService: ShopsService,
    private jwtService: JwtService,
  ) {}

  async register(data: Prisma.UserCreateInput): Promise<Response<User>> {
    try {
      const registerUser: Response<User> = await this.usersService.create(data);

      if (!registerUser) throw new BadRequestException('Bad Request');

      delete registerUser.data.password;

      return registerUser;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async validateUser(
    username: string,
    password: string,
    shop_code: string,
  ): Promise<Response<any>> {
    try {
      const user: Response<User> =
        await this.usersService.findOneByUsername(username);
      if (!user.data) throw new NotFoundException('User Not Found');

      const shop: Response<Shop> =
        await this.shopsService.findOneByCode(shop_code);
      if (!shop.data) throw new NotFoundException('Shop Not Found');

      const isMatch = await bcrypt.compare(password, user.data.password);
      if (!isMatch) throw new UnauthorizedException('Wrong Password');

      const payload = {
        sub: user.data.id,
        username: user.data.username,
        shop_code: shop.data.code,
      };
      const accessToken = await this.jwtService.signAsync(payload);

      delete user.data.password;

      const response = {
        ...user.data,
        shop_code: shop.data.code,
      };

      return {
        statusCode: 200,
        message: 'OK',
        data: response,
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
