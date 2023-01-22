import { Module, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core';

import { ExceptionFilter } from './exception.filter';
import { DatabaseModule } from './database/database.module';
import { ConfigModule } from './config/config.module';
import { LoggerModule } from './logger';

import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { CommonModule } from './common/common.module';
import { UserRoleModule } from './user-role/user-role.module';
import { CountryModule } from './country/country.module';
import { CityModule } from './city/city.module';
import { StateModule } from './state/state.module';


import { JwtGuard } from './common/gaurds/jwt.guard';
import { JwtModule } from './jwt/jwt.module';
import { RequestResponseInterceptor } from './common/interceptors/request-response.interceptor';
import { PinCodeModule } from './pin-code/pin-code.module';
import { RolesGuard } from './common/gaurds/roles.guard';

@Module({
  imports: [
    ConfigModule,
    JwtModule,
    CommonModule,
    DatabaseModule,
    LoggerModule,
    AuthModule,
    UserModule,
    UserRoleModule,
    CountryModule,
    CityModule,
    StateModule,
    PinCodeModule,
  ],
  controllers: [],
  providers: [
    ConfigService,
    {
      provide: APP_FILTER,
      useClass: ExceptionFilter,
    },
    {
      provide: APP_GUARD,
      useClass: JwtGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: RequestResponseInterceptor,
    },
    {
      provide: APP_PIPE,
      useValue: new ValidationPipe({
        transform: true,
        whitelist: true,
        forbidNonWhitelisted: true,
        transformOptions: {
          enableImplicitConversion: false,
        },
      }),
    },
  ],
})
export class ApiModule {}
