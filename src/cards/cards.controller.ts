import {
  Body,
  Controller,
  DefaultValuePipe,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  Req,
  Request,
  UseGuards,
} from '@nestjs/common';
import { CardsService } from './cards.service';
import {
  AuthGuard,
  CrewGuard,
  RoleGuard,
  ShopGuard,
} from 'src/auth/auth.guard';
import { CreateReportWithCardDto } from 'src/reports/dto/create-report.dto';
import { ValidationPipe } from 'src/validation.pipe';
import { CreateCardDto } from './dto/create-card.dto';
import { UserRole } from 'src/enums/user';

@Controller('cards')
export class CardsController {
  constructor(private readonly cardsService: CardsService) {}

  @UseGuards(
    AuthGuard,
    new RoleGuard([UserRole.ADMIN, UserRole.GREETER, UserRole.MANAGER]),
    ShopGuard,
  )
  @Post()
  create(
    @Req() request: Request,
    @Body(new ValidationPipe()) createCardDto: CreateCardDto,
  ) {
    return this.cardsService.create(request, createCardDto);
  }

  @UseGuards(AuthGuard, ShopGuard)
  @Get()
  findAll(
    @Req() request: Request,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
  ) {
    return this.cardsService.findAll(request, page);
  }

  @UseGuards(AuthGuard, ShopGuard)
  @Get(':cardNumber')
  findOneByCardNumber(
    @Req() request: Request,
    @Param('cardNumber') cardNumber: string,
  ) {
    return this.cardsService.findOneByCardNumber(request, cardNumber);
  }

  @UseGuards(
    AuthGuard,
    new RoleGuard([UserRole.ADMIN, UserRole.GREETER, UserRole.MANAGER]),
    ShopGuard,
    CrewGuard,
  )
  @Patch(':id/topup/activate')
  topUpAndActivate(
    @Param('id') id: string,
    @Body('customerName') customerName: string,
    @Body('customerId') customerId: string,
    @Body('addBalance') addBalance: string,
    @Body('paymentMethodId') paymentMethodId: string,
    @Body('note') note: string,
    @Req() req: Request,
  ) {
    return this.cardsService.topUpAndActivate(
      id,
      customerName,
      customerId,
      +addBalance,
      paymentMethodId,
      note,
      req,
    );
  }

  @UseGuards(
    AuthGuard,
    new RoleGuard([UserRole.ADMIN, UserRole.GREETER, UserRole.MANAGER]),
    ShopGuard,
    CrewGuard,
  )
  @Patch(':id/topup')
  topUp(
    @Param('id') id: string,
    @Body('addBalance') addBalance: string,
    @Body('paymentMethod') paymentMethod: string,
    @Body('note') note: string,
    @Req() req: Request,
  ) {
    return this.cardsService.topUp(id, +addBalance, paymentMethod, note, req);
  }

  @UseGuards(
    AuthGuard,
    new RoleGuard([UserRole.ADMIN, UserRole.GREETER, UserRole.MANAGER]),
    ShopGuard,
    CrewGuard,
  )
  @Patch(':id/checkout')
  checkout(
    @Param('id') id: string,
    @Body('paymentMethod') paymentMethod: string,
    @Body('note') note: string,
    @Req() req: Request,
  ) {
    return this.cardsService.checkout(id, paymentMethod, note, req);
  }

  @UseGuards(
    AuthGuard,
    new RoleGuard([UserRole.ADMIN, UserRole.GREETER, UserRole.MANAGER]),
    ShopGuard,
    CrewGuard,
  )
  @Patch(':id/adjust')
  adjustBalance(
    @Param('id') id: string,
    @Body('adjustedBalance') adjustedBalance: string,
    @Body('note') note: string,
    @Req() req: Request,
  ) {
    return this.cardsService.adjustBalance(id, +adjustedBalance, note, req);
  }

  @UseGuards(AuthGuard, new RoleGuard([UserRole.ADMIN]), ShopGuard)
  @Patch(':id/pay')
  pay(
    @Param('id') id: string,
    @Body() data: CreateReportWithCardDto,
    @Request() req,
  ) {
    return this.cardsService.pay(id, data, req);
  }
}
