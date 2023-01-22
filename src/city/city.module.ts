import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { CityController } from './city.controller';
import { CityService } from './city.service';
import { City } from './entities/city.entity';

@Module({
  imports: [SequelizeModule.forFeature([City])],
  controllers: [CityController],
  providers: [CityService],
})
export class CityModule {}
