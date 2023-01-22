import { Module } from '@nestjs/common';
import { FilesService } from './files.service';
import { FilesController } from './files.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { File } from './entities/file.entity';
import { Attachment } from './entities/attachment.entity';

@Module({
  imports: [SequelizeModule.forFeature([File, Attachment])],
  controllers: [FilesController],
  providers: [FilesService],
})
export class FilesModule {}
