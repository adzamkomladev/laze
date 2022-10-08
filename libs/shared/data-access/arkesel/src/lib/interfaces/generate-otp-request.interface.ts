export interface GenerateOtpRequest {
  expiry: number;
  length: number;
  medium: "voice" | "sms";
  message: string;
  number: string;
  senderId: string;
  type: "numeric" | "alphanumeric";
}
