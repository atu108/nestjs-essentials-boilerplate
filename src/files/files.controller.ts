import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FilesService } from './files.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { UploadFiledDto } from './dto/upload-file.dto';
import { ACCESS_TYPE } from '../common/constants/user.constant';
import { Roles } from '../common/decorators/roles.decorator';

const routeName = 'files';
@ApiTags(routeName)
@ApiBearerAuth('token')
@Controller(routeName)
@Roles(
  ACCESS_TYPE.ADMIN,
  ACCESS_TYPE.MANAGER,
  ACCESS_TYPE.AM,
  ACCESS_TYPE.AUDITOR,
  ACCESS_TYPE.TL,
  ACCESS_TYPE.FSE,
)
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  @Post()
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('file'))
  @ApiBody({
    type: UploadFiledDto,
  })
  async upload(@UploadedFile() file) {
    return this.filesService.upload(file);
  }
}
