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
}