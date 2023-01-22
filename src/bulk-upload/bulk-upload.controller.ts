import {
  Body,
  Controller,
  Post,
  Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { diskStorage } from 'multer';
import { ACCESS_TYPE } from '../common/constants/user.constant';
import { Roles } from '../common/decorators/roles.decorator';
import { BulkUploadService } from './bulk-upload.service';
import { BulkUploadDto } from './dto/bulk-upload.dto';
import { ExcelGenerateDto } from './dto/excel-generate.dto';

const routeName = 'bulk-upload';

@ApiTags(routeName)
@ApiBearerAuth('token')
@Controller(routeName)
@Roles(ACCESS_TYPE.ADMIN)
export class BulkUploadController {
  constructor(private readonly bulkUploadService: BulkUploadService) {}

  @Post('formate')
  async getFile(@Res() res, @Body() excelGenerate: ExcelGenerateDto) {
    const filePath = await this.bulkUploadService.getExcel(excelGenerate.type);
    res.set({
      'Content-Type':
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    });
    res.setHeader('Content-Disposition', 'attachment; filename=' + filePath);
    return res.download(filePath);
  }

  @Post('excel')
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    type: BulkUploadDto,
  })
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: process.env.EXCEL_FILE_PATH,
        filename: function (req, file, cb) {
          cb(null, file.originalname);
        },
      }),
    }),
  )
  async excel(@UploadedFile() file, @Body() bulkUploadDto: BulkUploadDto[]) {
    await this.bulkUploadService.bulkAdding(file, bulkUploadDto);
    return {
      status: 'success',
    };
  }
}
