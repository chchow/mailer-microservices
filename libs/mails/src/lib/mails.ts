// export function mails(): string {
//   return 'mails';
// }

export interface MailDto {
  to: string;
  from: string;
  subject: string;
  text: string;
}

export const MAIL_QUEUE = "MAIL_QUEUE";
export const CONFIRM_REGISTRATION = "CONFIRM_REGISTRATION";
export const CUSTOM_MAIL = "CUSTOM_MAIL";