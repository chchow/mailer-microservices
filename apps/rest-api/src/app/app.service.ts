import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class AppService {
  constructor(@Inject('MAILER') private client: ClientProxy) {}
  getData(): { message: string } {
    const confirmUrl = "https://link.test?ey=testexample2";
    const emailAddress = "choonghoe@gmail.com"
    this.client.emit({cmd: 'send-message'}, { emailAddress, confirmUrl }).subscribe();
    return { message: 'Welcome to rest-api for mail service!' };
  }
}
