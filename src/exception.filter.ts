import {
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Inject,
  BadRequestException,
} from '@nestjs/common';
import { HttpArgumentsHost } from '@nestjs/common/interfaces';
import { BaseExceptionFilter } from '@nestjs/core';
import { Request, Response } from 'express';
import { LoggerService } from './logger';
@Catch()
export class ExceptionFilter extends BaseExceptionFilter {
  constructor(@Inject(LoggerService) private logger: LoggerService) {
    super();
  }

  private validationError(errors: any) {
    const _errors: Array<any> = [];

    Object.keys(errors).forEach((field: any) => {
      const _error: any = errors[field];
      _errors.push({
        [field]: _error.kind,
      });
    });

    return {
      status: HttpStatus.BAD_REQUEST,
      errors: _errors,
    };
  }

  private dupKey(info: any) {
    const errors: Array<any> = [];

    Object.keys(info).forEach((key: string) => {
      errors.push({
        [key]: `${info[key]} already exists.`,
      });
    });

    return errors;
  }

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx: HttpArgumentsHost = host.switchToHttp();

    const res: Response = ctx.getResponse<Response>(),
      req: Request = ctx.getRequest<Request>();
    this.logger.error(JSON.stringify(exception as object));
    if (process.env.NODE_ENV == 'development') {
      console.error(exception as object);
    }
    if (!exception) {
      return;
    }
    switch (exception.constructor.name) {
      case 'ForeignKeyConstraintError': {
        return res.status(400).json({
          statusCode: 400,
          timestamp: new Date().toISOString(),
          path: req.url,
          errors: [{ message: 'One or more invalid ids selected' }],
        });
      }

      case 'UniqueConstraintError': {
        /*
          Eg: key value violates unique constraint "Cities_name_key"
        */
        return res.status(HttpStatus.CONFLICT).json({
          statusCode: HttpStatus.CONFLICT,
          timestamp: new Date().toISOString(),
          path: req.url,
          errors: [{ message: 'Data already exists!' }],
        });
      }

      case 'DatabaseError': {
        /*
          UUID error 
          eg: invalid input syntax for type uuid: "createdBy"
        */
        if (exception['parent']['code'] == '22P02') {
          return res.status(400).json({
            statusCode: 400,
            timestamp: new Date().toISOString(),
            path: req.url,
            errors: [{ message: 'One or more invalid ids selected' }],
          });
        }

        if (exception['parent']['code'] == '42703') {
          return res.status(400).json({
            statusCode: 400,
            timestamp: new Date().toISOString(),
            path: req.url,
            errors: [{ message: 'One or more invalid ids selected' }],
          });
        }

        /*
         eg: update or delete on table "Ifscs" violates foreign key constraint "BankDetails_ifscId_fkey" on table "BankDetails"
        */
        if (exception['parent']['code'] == '23503') {
          return res.status(400).json({
            statusCode: 400,
            timestamp: new Date().toISOString(),
            path: req.url,
            errors: [
              {
                message: 'Can not update or delete ! foreign key constraint !',
              },
            ],
          });
        }

        return res.status(400).json({
          statusCode: 400,
          timestamp: new Date().toISOString(),
          path: req.url,
          errors: [{ message: 'DB Error' }],
        });
      }

      case 'ValidationError': {
        const { status, errors }: any = this.validationError(
          exception['errors'],
        );
        return res.status(status).json({
          statusCode: status,
          timestamp: new Date().toISOString(),
          path: req.url,
          errors,
        });
      }

      case 'ForbiddenException': {
        return res.status(HttpStatus.FORBIDDEN).json({
          statusCode: HttpStatus.FORBIDDEN,
          timestamp: new Date().toISOString(),
          path: req.url,
          errors: [{ message: 'Forbidden' }],
        });
      }

      case 'UnauthorizedException': {
        return res.status(HttpStatus.UNAUTHORIZED).json({
          statusCode: HttpStatus.UNAUTHORIZED,
          timestamp: new Date().toISOString(),
          path: req.url,
          errors: [{ message: 'Unauthorized' }],
        });
      }

      case 'TokenExpiredError': {
        return res.status(HttpStatus.UNAUTHORIZED).json({
          statusCode: HttpStatus.UNAUTHORIZED,
          timestamp: new Date().toISOString(),
          path: req.url,
          errors: [{ message: 'Unauthorized' }],
        });
      }

      case 'BadRequestException': {
        const statusCode: number = (
          exception as BadRequestException
        ).getStatus();
        const errorMessages = (exception as HttpException).getResponse()[
          'message'
        ];
        return res.status(statusCode).json({
          statusCode,
          timestamp: new Date().toISOString(),
          path: req.url,
          errors: errorMessages,
        });
      }

      case 'HttpException': {
        const statusCode: number = (exception as HttpException).getStatus(),
          message: string = (exception as HttpException).message;

        return res.status(statusCode).json({
          statusCode,
          timestamp: new Date().toISOString(),
          path: req.url,
          errors: [{ message }],
        });
      }

      default:
        return res.status(500).json({
          statusCode: 500,
          timestamp: new Date().toISOString(),
          path: req.url,
          errors: [{ message: 'Something went wrong' }],
        });
    }
  }
}
