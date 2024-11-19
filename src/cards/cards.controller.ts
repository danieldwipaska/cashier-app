import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { CardsService } from './cards.service';
import { Prisma } from '@prisma/client';
import { CrewGuard } from 'src/auth/auth.guard';

@Controller('cards')
export class CardsController {
  constructor(private readonly cardsService: CardsService) {}

  @Post()
  create(@Body() data: Prisma.CardCreateInput) {
    return this.cardsService.create(data);
  }

  @Get()
  findAll() {
    return this.cardsService.findAll();
  }

  @Get(':cardNumber')
  findOneByCardNumber(@Param('cardNumber') cardNumber: string) {
    return this.cardsService.findOneByCardNumber(cardNumber);
  }

  @UseGuards(CrewGuard)
  @Patch(':id/topup/activate')
  topUpAndActivate(
    @Param('id') id: string,
    @Body('customerName') customerName: string,
    @Body('customerId') customerId: string,
    @Body('addBalance') addBalance: string,
    @Body('paymentMethod') paymentMethod: string,
    @Body('note') note: string,
    @Req() req: Request,
  ) {
    return this.cardsService.topUpAndActivate(
      id,
      customerName,
      customerId,
      +addBalance,
      paymentMethod,
      note,
      req,
    );
  }

  @UseGuards(CrewGuard)
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

  @UseGuards(CrewGuard)
  @Patch(':id/checkout')
  checkout(
    @Param('id') id: string,
    @Body('paymentMethod') paymentMethod: string,
    @Body('note') note: string,
    @Req() req: Request,
  ) {
    return this.cardsService.checkout(id, paymentMethod, note, req);
  }

  @UseGuards(CrewGuard)
  @Patch(':id/adjust')
  adjustBalance(
    @Param('id') id: string,
    @Body('adjustedBalance') adjustedBalance: string,
    @Body('note') note: string,
    @Req() req: Request,
  ) {
    return this.cardsService.adjustBalance(id, +adjustedBalance, note, req);
  }

  @Patch(':id/pay')
  pay(@Param('id') id: string, @Body() data: Prisma.ReportCreateInput) {
    return this.cardsService.pay(id, data);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.cardsService.remove(id);
  }
}
