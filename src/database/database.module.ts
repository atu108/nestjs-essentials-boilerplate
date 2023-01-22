import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Sequelize } from 'sequelize-typescript';
import { SequelizeModule } from '@nestjs/sequelize';
import { APPLICATION_NAME } from '../common/constants/app.constant';
import { parseConnectionString } from '../common/utils';
import { createNamespace } from 'cls-hooked';

import { models } from './models';

@Module({
  imports: [
    SequelizeModule.forRootAsync({
      useFactory: (config: ConfigService) => {
        (Sequelize as any).__proto__.useCLS(
          createNamespace('bizisell-transactions'),
        );
        const dbUriParts = parseConnectionString(process.env.DATABASE_URL);
        return {
          dialect: 'postgres',
          name: APPLICATION_NAME,
          host: dbUriParts.host || '127.0.0.1',
          port: dbUriParts.port || 5432,
          username: dbUriParts.username || 'postgres',
          password: dbUriParts.password,
          database: dbUriParts.database || 'postgres',
          autoLoadModels: true,
          timestamps: true,
          paranoid: true,
          models,
          logging: false,
        };
      },
      inject: [ConfigService],
    }),
  ],
})
export class DatabaseModule {}
