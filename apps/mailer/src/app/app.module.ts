import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as Joi from '@hapi/joi';

import { MailController } from './controllers/mail.controller';
import { MailService } from './services/mail.service';
import { MailProcessor } from './processors/mail.processors';
import { MAIL_QUEUE } from '@mailer-microservices/mails';
import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from "@nestjs-modules/mailer/dist/adapters/handlebars.adapter";

@Module({
  imports: [
    BullModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        redis: {
          host: configService.get<string>('REDIS_HOST'),
          port: +configService.get<number>('REDIS_PORT'),
        },
      }),
      inject: [ConfigService],
    }),
    ConfigModule.forRoot({
      validationSchema: Joi.object({
        EMAIL_HOST: Joi.string().required(),
        EMAIL_PORT: Joi.number().required(),
        EMAIL_ADDRESS: Joi.string().required(),
        EMAIL_PASSWORD: Joi.string().required(),
        REDIS_HOST: Joi.string().required(),
        REDIS_PORT: Joi.number().required(),
      }),
    }),
    BullModule.registerQueue({
      name: MAIL_QUEUE,
    }),
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        transport: {
          host: configService.get("EMAIL_HOST"),
          port: +configService.get("EMAIL_PORT"),
          auth: {
            user: configService.get("EMAIL_ADDRESS"),
            pass: configService.get("EMAIL_PASSWORD"),
          },
        },
        defaults: { from: '"NestJS Mailer" <test@test.com>' }, // the header of the received emails is defined here. Customize this for your application.
        template: {
          dir: __dirname + "/templates", // here you must specify the path where the directory with all email templates is located
          adapter: new HandlebarsAdapter(),
          options: { strict: true },
        },
      }),
    }),
  ],
  controllers: [MailController],
  providers: [MailService, MailProcessor],
})
export class AppModule {}
