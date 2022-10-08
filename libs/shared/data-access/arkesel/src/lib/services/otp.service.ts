import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';

import { map, Observable } from 'rxjs';

import { GenerateOtpRequest } from '../interfaces';
import { VerifyOtpRequest } from '../interfaces';
import { OtpResponse } from '../interfaces';

@Injectable()
export class OtpService {
  constructor(
    private readonly config: ConfigService,
    private readonly http: HttpService
  ) {}

  generateOtp(generateOtpRequest: GenerateOtpRequest): Observable<OtpResponse> {
    return this.http
      .post(this.config.get<string>('otp.generateOtpUrl'), {
        ...generateOtpRequest,
        sender_id: generateOtpRequest.senderId,
      })
      .pipe(
        map((response) => {
          if (response.status === 200 && response.data.code === '1000') {
            return {
              success: true,
              message: response.data.message,
            };
          }

          return {
            success: false,
            message: response.data?.message ?? response.statusText,
          };
        })
      );
  }

  verifyOtp(verifyOtpRequest: VerifyOtpRequest): Observable<OtpResponse> {
    return this.http
      .post(this.config.get<string>('otp.verifyOtpUrl'), {
        ...verifyOtpRequest,
      })
      .pipe(
        map((response) => {
          if (response.status === 200 && response.data.code === '1100') {
            return {
              success: true,
              message: response.data.message,
            };
          }

          return {
            success: false,
            message: response.data?.message ?? response.statusText,
          };
        })
      );
  }
}
