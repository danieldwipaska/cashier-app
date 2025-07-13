import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
  Req,
} from '@nestjs/common';
import { FnbModifiersService } from './fnb-modifiers.service';
import { CreateFnbModifierDto } from './dto/create-fnb-modifier.dto';
import { AuthGuard, ShopGuard } from 'src/auth/auth.guard';

@Controller('fnb-modifiers')
export class FnbModifiersController {
  constructor(private readonly fnbModifiersService: FnbModifiersService) {}

  @UseGuards(AuthGuard, ShopGuard)
  @Post()
  create(
    @Req() request: Request,
    @Body() createFnbModifierDto: CreateFnbModifierDto,
  ) {
    return this.fnbModifiersService.create(request, createFnbModifierDto);
  }

  @UseGuards(AuthGuard, ShopGuard)
  @Get('fnb/:id')
  findByFnb(@Req() request: Request, @Param('id') id: string) {
    return this.fnbModifiersService.findByFnb(request, id);
  }

  @UseGuards(AuthGuard, ShopGuard)
  @Get('modifier/:id')
  findByModifier(@Req() request: Request, @Param('id') id: string) {
    return this.fnbModifiersService.findByModifier(request, id);
  }

  @Delete(':id')
  remove(
    @Body('fnb_id') fnb_id: string,
    @Body('modifier_id') modifier_id: string,
    @Req() request: any,
  ) {
    return this.fnbModifiersService.remove(request, fnb_id, modifier_id);
  }
}
