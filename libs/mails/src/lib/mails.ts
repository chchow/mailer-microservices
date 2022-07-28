// export function mails(): string {
//   return 'mails';
// }

export interface Mail {
  to: string;
  from: string;
  subject: string;
  template: string;
  // context: any;
}

export const MAIL_QUEUE = "MAIL_QUEUE";
export const CONFIRM_REGISTRATION = "CONFIRM_REGISTRATION";