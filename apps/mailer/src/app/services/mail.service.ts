import { Injectable, Logger } from "@nestjs/common";
import { Queue } from "bull";
import { InjectQueue } from "@nestjs/bull";
import { MAIL_QUEUE, CONFIRM_REGISTRATION, MailDto, CUSTOM_MAIL } from '@mailer-microservices/mails';

@Injectable()
export class MailService {
  private readonly _logger = new Logger(MailService.name);

  constructor(@InjectQueue(MAIL_QUEUE) private readonly _mailQueue: Queue) {}

  public async sendConfirmationEmail(emailAddress: string, confirmUrl: string): Promise<void> {
    try {
      await this._mailQueue.add(CONFIRM_REGISTRATION, {
        emailAddress,
        confirmUrl,
      });
    } catch (error) {
      this._logger.error(`Error queueing registration email to user ${emailAddress}`);

      throw error;
    }
  }
  public async sendCustomEmail(mail: MailDto): Promise<void> {
    try {
      await this._mailQueue.add(CUSTOM_MAIL, {
        mail
      });
    } catch (error) {
      this._logger.error(`Error queueing custom email to user ${mail.to}`);

      throw error;
    }
  }
}