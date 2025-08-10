import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  ValidationPipe,
  Req,
} from '@nestjs/common';
import { ModifiersService } from './modifiers.service';
import { CreateModifierDto } from './dto/create-modifier.dto';
import { UpdateModifierDto } from './dto/update-modifier.dto';
import { AuthGuard, RoleGuard, ShopGuard } from 'src/auth/auth.guard';
import { UserRole } from 'src/enums/user';

@Controller('modifiers')
export class ModifiersController {
  constructor(private readonly modifiersService: ModifiersService) {}

  @UseGuards(
    AuthGuard,
    new RoleGuard([UserRole.ADMIN, UserRole.MANAGER, UserRole.GREETER]),
    ShopGuard,
  )
  @Post()
  create(
    @Req() request: Request,
    @Body(new ValidationPipe()) createModifierDto: CreateModifierDto,
  ) {
    return this.modifiersService.create(request, createModifierDto);
  }

  @UseGuards(AuthGuard, ShopGuard)
  @Get()
  findAll(@Req() request: Request) {
    return this.modifiersService.findAll(request);
  }

  @UseGuards(AuthGuard, ShopGuard)
  @Get(':id')
  findOne(@Req() request: Request, @Param('id') id: string) {
    return this.modifiersService.findOne(request, id);
  }

  @UseGuards(
    AuthGuard,
    new RoleGuard([UserRole.ADMIN, UserRole.MANAGER, UserRole.GREETER]),
    ShopGuard,
  )
  @Patch(':id')
  update(
    @Req() request: Request,
    @Param('id') id: string,
    @Body() updateModifierDto: UpdateModifierDto,
  ) {
    return this.modifiersService.update(request, id, updateModifierDto);
  }

  @UseGuards(AuthGuard, new RoleGuard([UserRole.ADMIN]), ShopGuard)
  @Delete(':id')
  remove(@Req() request: Request, @Param('id') id: string) {
    return this.modifiersService.remove(request, id);
  }
}
