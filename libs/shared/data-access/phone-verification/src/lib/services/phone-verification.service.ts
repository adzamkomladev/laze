import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { lastValueFrom, map, Observable } from 'rxjs';

import { OtpService } from '@laze/nestjs-arkesel';

import { SendCodeRequest } from '../interfaces';
import { VerifyCodeRequest } from '../interfaces';
import { Response } from '../interfaces';

@Injectable()
export class PhoneVerificationService {
  constructor(
    private readonly config: ConfigService,
    private readonly otp: OtpService
  ) {}

  async sendCode(sendCodeRequest: SendCodeRequest): Promise<Response> {
    try {
      if (!sendCodeRequest.message.includes('%otp_code%')) {
        return {
          success: false,
          message: 'No OTP code variable found!',
        };
      }

      const generateOtpRequest = {
        number: sendCodeRequest.number,
        message: sendCodeRequest.message,
        expiry: sendCodeRequest.expiry ?? this.config.get<number>('expiry'),
        senderId: this.config.get<string>('senderId'),
        type:
          sendCodeRequest.type ??
          this.config.get<'numeric' | 'alphanumeric'>('type'),
        medium:
          sendCodeRequest.medium ?? this.config.get<'sms' | 'voice'>('medium'),
        length: sendCodeRequest.length ?? this.config.get<number>('length'),
      };

      const generateOtp$: Observable<Response> = this.otp
        .generateOtp(generateOtpRequest)
        .pipe(
          map((res) => {
            if (res.success) {
              return {
                success: true,
                message: 'Code sent successfully',
                data: generateOtpRequest as SendCodeRequest,
              };
            }

            return {
              success: false,
              message: res.message,
            };
          })
        );

      return await lastValueFrom(generateOtp$);
    } catch (e) {
      return {
        success: false,
        message: 'Failed to send code',
      };
    }
  }

  async verifyCode(verifyCodeRequest: VerifyCodeRequest): Promise<Response> {
    try {
      const verifyOtp: Observable<Response> = this.otp
        .verifyOtp(verifyCodeRequest)
        .pipe(
          map((res) => {
            if (res.success) {
              return {
                success: true,
                message: 'Code has been verified',
                data: verifyCodeRequest,
              };
            }
            return {
              success: false,
              message: res.message,
            };
          })
        );

      return await lastValueFrom(verifyOtp);
    } catch (e) {
      return {
        success: false,
        message: 'Failed to verify code',
      };
    }
  }
}
