import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { Request } from 'express';
import { CrewsService } from 'src/crews/crews.service';
import { ShopsService } from 'src/shops/shops.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);
    if (!token) {
      throw new UnauthorizedException();
    }
    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: 'thisissecret',
      });
      // 💡 We're assigning the payload to the request object here
      // so that we can access it in our route handlers
      request['user'] = payload;
    } catch {
      throw new UnauthorizedException();
    }
    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}

@Injectable()
export class CrewGuard implements CanActivate {
  constructor(private crewsService: CrewsService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    try {
      const crew = await this.crewsService.findOneByCode(
        request,
        request.body.crewCode,
      );

      if (!crew) {
        throw new UnauthorizedException();
      }

      request['crew'] = crew.data;
    } catch {
      throw new UnauthorizedException();
    }

    return true;
  }
}

@Injectable()
export class ShopGuard implements CanActivate {
  constructor(private shopsService: ShopsService) {}

  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    const shopCode = request.user?.shop_code;

    if (shopCode) {
      try {
        const shop = await this.shopsService.findOneByCode(shopCode);
        request['shop'] = shop.data;
      } catch (error) {
        throw error;
      }
    }

    return true;
  }
}
