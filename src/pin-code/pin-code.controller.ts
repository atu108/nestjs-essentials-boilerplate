import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ACCESS_TYPE } from '../common/constants/user.constant';
import { Public } from '../common/decorators/public.decorator';
import { Roles } from '../common/decorators/roles.decorator';
import { CreatePinCodeDto } from './dto/create-pincode.dto';
import { FilterPinCodeDto } from './dto/filter-pincode.dto';
import { UpdatePinCodeDto } from './dto/update-pincode.dto';
import { PinCodeService } from './pin-code.service';

const routeName = 'pin-codes';
@ApiTags(routeName)
@ApiBearerAuth('token')
@Controller(routeName)
@Roles(ACCESS_TYPE.ADMIN)
export class PinCodeController {
  constructor(private readonly pinCodeService: PinCodeService) {}

  @Public()
  @Get()
  findAll(@Query() filterPinCodeDto: FilterPinCodeDto) {
    return this.pinCodeService.findAll(filterPinCodeDto);
  }

  @Post()
  add(@Body() createPinCode: CreatePinCodeDto) {
    return this.pinCodeService.add(createPinCode);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePinCode: UpdatePinCodeDto) {
    return this.pinCodeService.update(id, updatePinCode);
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.pinCodeService.delete(id);
  }
}
