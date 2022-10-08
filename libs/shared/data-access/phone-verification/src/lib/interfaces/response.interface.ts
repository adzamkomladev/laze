import { SendCodeRequest } from './send-code-request.interface';
import { VerifyCodeRequest } from './verify-code-request.interface';

export interface Response {
  success: boolean;
  message: string;
  data?: SendCodeRequest | VerifyCodeRequest;
}
