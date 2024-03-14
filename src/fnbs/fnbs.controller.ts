import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { FnbsService } from './fnbs.service';
import { CreateFnbDto } from './dto/create-fnb.dto';
import { UpdateFnbDto } from './dto/update-fnb.dto';

@Controller('fnbs')
export class FnbsController {
  constructor(private readonly fnbsService: FnbsService) {}

  @Post()
  create(@Body() createFnbDto: CreateFnbDto) {
    return this.fnbsService.create(createFnbDto);
  }

  @Get()
  findAll() {
    return this.fnbsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.fnbsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateFnbDto: UpdateFnbDto) {
    return this.fnbsService.update(+id, updateFnbDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.fnbsService.remove(+id);
  }
}
