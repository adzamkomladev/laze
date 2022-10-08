export interface SendCodeRequest {
  number: string;
  message: string;
  expiry?: number;
  length?: number;
  type?: 'numeric' | 'alphanumeric';
  medium?: 'sms' | 'voice';
}
