import { MailDto } from '@mailer-microservices/mails';
import { Body, Controller, Get, Logger, Post } from '@nestjs/common';

import { AppService } from './app.service';

@Controller()
export class AppController {
  private readonly _logger = new Logger(AppController.name);
  constructor(private readonly appService: AppService) {}

  @Get()
  getData() {
    return this.appService.getData();
  }

  @Post('sendmail')
  sendmail(@Body() body: MailDto) {
    this._logger.debug('Received mail to be send with body: ' + JSON.stringify(body));
    console.log(body);
    this.appService.sendCustomMail(body);
    return { message : 'Mail is queued for sending...', received: body };
  }
}
