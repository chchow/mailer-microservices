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