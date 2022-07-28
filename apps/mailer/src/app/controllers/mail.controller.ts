import { MailDto } from "@mailer-microservices/mails";
import { Controller } from "@nestjs/common";
import { EventPattern } from "@nestjs/microservices";
import { MailService } from '../services/mail.service';

@Controller()
export class MailController {
  constructor(private readonly _mailService: MailService) {}

  @EventPattern({ cmd: "send-message" })
  async sendConfirmationEmail(emailAddress: string, confirmUrl: string): Promise<void> {
    console.log('sending confirmation email', emailAddress, confirmUrl);
    return this._mailService.sendConfirmationEmail(emailAddress, confirmUrl);
  }
  @EventPattern({ cmd: "send-custom-message" })
  async sendCustomEmail(mail: MailDto): Promise<void> {
    console.log('sending custom email', mail);
    return this._mailService.sendCustomEmail(mail);
  }
}