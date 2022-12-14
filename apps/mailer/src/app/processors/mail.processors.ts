import { MailerService } from '@nestjs-modules/mailer';
import { OnQueueActive, OnQueueCompleted, OnQueueFailed, Process, Processor } from '@nestjs/bull';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Job } from 'bull';
import { MAIL_QUEUE, CONFIRM_REGISTRATION, CUSTOM_MAIL, MailDto } from '@mailer-microservices/mails';

@Injectable()
@Processor(MAIL_QUEUE)
export class MailProcessor {
  private readonly _logger = new Logger(MailProcessor.name);

  constructor(
    private readonly _mailerService: MailerService,
    private readonly _configService: ConfigService
  ) {}

  @Process(CONFIRM_REGISTRATION) // here is the name of the executed process
  public async confirmRegistration(
    job: Job<{ emailAddress: {emailAddress: string; confirmUrl: string }}>
  ) {
    this._logger.log(
      `Sending confirm registration email to '${job.data.emailAddress.emailAddress}'`
    );

    try {
      return this._mailerService.sendMail({
        to: job.data.emailAddress.emailAddress,
        from: this._configService.get('EMAIL_ADDRESS'),
        subject: 'Registration',
        template: './registration', // ! it must point to a template file name without the .hbs extension
        context: { confirmUrl: job.data.emailAddress.confirmUrl }, // here you pass the variables that you use in the hbs template
      });
    } catch {
      this._logger.error(
        `Failed to send confirmation email to '${job.data.emailAddress}'`
      );
    }
  }
  @Process(CUSTOM_MAIL) // here is the name of the executed process
  public async customEmail(
    job: Job<{ mail: {mail: MailDto} }>
  ) {
    this._logger.log(
      `Sending confirm custom email to '${job.data.mail.mail.to}'`
    );

    try {
      return this._mailerService.sendMail({
        to: job.data.mail.mail.to,
        from: this._configService.get('EMAIL_ADDRESS'),
        subject: job.data.mail.mail.subject,
        template: './custom_mail', // ! it must point to a template file name without the .hbs extension
        context: { customMsg: job.data.mail.mail.text }, // here you pass the variables that you use in the hbs template
      });
    } catch {
      this._logger.error(
        `Failed to send confirmation email to '${job.data.mail.mail.to}'`
      );
    }
  }
  @OnQueueActive()
  public onActive(job: Job) {
    this._logger.debug(`Processing job ${job.id} of type ${job.name}`);
  }

  @OnQueueCompleted()
  public onComplete(job: Job) {
    this._logger.debug(`Completed job ${job.id} of type ${job.name}`);
  }

  @OnQueueFailed()
  public onError(job: Job<any>, error: any) {
    this._logger.error(
      `Failed job ${job.id} of type ${job.name}: ${error.message}`,
      error.stack
    );
  }
}
