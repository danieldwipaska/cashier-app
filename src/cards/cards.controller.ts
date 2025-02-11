import {
  Body,
  Controller,
  DefaultValuePipe,
  Delete,
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
import { Prisma } from '@prisma/client';
import { AuthGuard, CrewGuard } from 'src/auth/auth.guard';
import { CreateReportWithCardDto } from 'src/reports/dto/create-report.dto';

@Controller('cards')
export class CardsController {
  constructor(private readonly cardsService: CardsService) {}

  @Post()
  create(@Body() data: Prisma.CardCreateInput) {
    return this.cardsService.create(data);
  }

  @Get()
  findAll(@Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number) {
    return this.cardsService.findAll(page);
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

  @UseGuards(AuthGuard)
  @Patch(':id/pay')
  pay(
    @Param('id') id: string,
    @Body() data: CreateReportWithCardDto,
    @Request() req,
  ) {
    return this.cardsService.pay(id, data, req.user.username);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.cardsService.remove(id);
  }
}
