import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';

import { of } from 'rxjs';

import {
  GenerateOtpRequest,
  OtpResponse,
  OtpService,
} from '@laze/nestjs-arkesel';

import { PhoneVerificationService } from './phone-verification.service';

import { SendCodeRequest } from '@laze/nestjs-phone-verification';
import { Response } from '@laze/nestjs-phone-verification';
import { VerifyCodeRequest } from '@laze/nestjs-phone-verification';

describe('PhoneNumberVerificationService', () => {
  const mockOtpService = () => ({
    generateOtp: jest.fn(),
    verifyOtp: jest.fn(),
  });

  const mockConfigService = () => ({
    get: jest.fn(),
  });

  let service: PhoneVerificationService;
  let otpService: OtpService;
  let configService: ConfigService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PhoneVerificationService,
        { provide: OtpService, useFactory: mockOtpService },
        { provide: ConfigService, useFactory: mockConfigService },
      ],
    }).compile();

    service = module.get<PhoneVerificationService>(
      PhoneVerificationService
    );
    otpService = module.get<OtpService>(OtpService);
    configService = module.get<ConfigService>(ConfigService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('sendCode', () => {
    it('should call OtpService.generateOtp with right parameters', async () => {
      const mockSendCodeRequest: SendCodeRequest = {
        message: 'Your OTP is %otp_code%',
        expiry: 5,
        length: 6,
        medium: 'sms',
        type: 'alphanumeric',
        number: '233202442452',
      };

      const mockOtpResponse: OtpResponse = {
        success: true,
        message: 'OTP generated successfully',
      };

      jest
        .spyOn(otpService, 'generateOtp')
        .mockImplementationOnce(() => of(mockOtpResponse));
      jest.spyOn(configService, 'get').mockImplementationOnce(() => 'Oak');

      await service.sendCode(mockSendCodeRequest);

      expect(otpService.generateOtp).toHaveBeenCalledWith({
        ...mockSendCodeRequest,
        senderId: 'Oak',
      } as GenerateOtpRequest);
      expect(otpService.generateOtp).toBeCalledTimes(1);
    });

    it('should return a successful response', async () => {
      const mockSendCodeRequest: SendCodeRequest = {
        message: 'Your OTP is %otp_code%',
        expiry: 5,
        length: 6,
        medium: 'sms',
        type: 'alphanumeric',
        number: '233202442452',
      };

      const mockOtpResponse: OtpResponse = {
        success: true,
        message: 'Successful, Message delivered',
      };

      const mockResponse: Response = {
        success: true,
        message: 'Code sent successfully',
        data: mockSendCodeRequest,
      };

      jest
        .spyOn(otpService, 'generateOtp')
        .mockImplementationOnce(() => of(mockOtpResponse));

      const res = await service.sendCode(mockSendCodeRequest);

      expect(otpService.generateOtp).toHaveBeenCalled();
      expect(res).toEqual(mockResponse);
    });

    it('should return a failed response when OtpService.generateOtp throws an exception', async () => {
      const mockSendCodeRequest: SendCodeRequest = {
        message: 'Your OTP is %otp_code%',
        expiry: 5,
        length: 6,
        medium: 'sms',
        type: 'alphanumeric',
        number: '233202442452',
      };

      const mockResponse: Response = {
        success: false,
        message: 'Failed to send code',
      };

      jest.spyOn(otpService, 'generateOtp').mockImplementation(() => {
        throw new Error('Error');
      });

      const res = await service.sendCode(mockSendCodeRequest);

      expect(otpService.generateOtp).toHaveBeenCalled();
      expect(res).toEqual(mockResponse);
    });

    it('should return a failed response when the message field in SendCodeRequest parameter is invalid', async () => {
      const mockSendCodeRequest: SendCodeRequest = {
        message: 'Your OTP is %otpcode%',
        expiry: 5,
        length: 6,
        medium: 'sms',
        type: 'alphanumeric',
        number: '233202442452',
      };

      const mockOtpResponse: OtpResponse = {
        success: true,
        message: 'Successful, Message delivered',
      };

      const mockResponse: Response = {
        success: false,
        message: 'No OTP code variable found!',
      };

      jest
        .spyOn(otpService, 'generateOtp')
        .mockImplementationOnce(() => of(mockOtpResponse));

      const res = await service.sendCode(mockSendCodeRequest);

      expect(otpService.generateOtp).toHaveBeenCalledTimes(0);
      expect(res).toEqual(mockResponse);
    });
  });

  describe('verifyCode', () => {
    it('should call OtpService.verifyCode with right parameters', async () => {
      const mockVerifyCodeRequest: VerifyCodeRequest = {
        code: '123456',
        number: '233202442452',
      };

      const mockOtpResponse: OtpResponse = {
        success: true,
        message: 'Successful',
      };

      jest
        .spyOn(otpService, 'verifyOtp')
        .mockImplementationOnce(() => of(mockOtpResponse));

      await service.verifyCode(mockVerifyCodeRequest);

      expect(otpService.verifyOtp).toHaveBeenCalledWith(mockVerifyCodeRequest);
      expect(otpService.verifyOtp).toBeCalledTimes(1);
    });

    it('should return a successful response', async () => {
      const mockVerifyCodeRequest: VerifyCodeRequest = {
        code: '123456',
        number: '233202442452',
      };

      const mockOtpResponse: OtpResponse = {
        success: true,
        message: 'Successful',
      };

      const mockResponse: Response = {
        success: true,
        message: 'Code has been verified',
        data: mockVerifyCodeRequest,
      };

      jest
        .spyOn(otpService, 'verifyOtp')
        .mockImplementationOnce(() => of(mockOtpResponse));

      const res = await service.verifyCode(mockVerifyCodeRequest);

      expect(otpService.verifyOtp).toHaveBeenCalled();
      expect(res).toEqual(mockResponse);
    });

    it('should return a failed response when OtpService.verifyOtp throws an exception', async () => {
      const mockVerifyCodeRequest: VerifyCodeRequest = {
        code: '123456',
        number: '233202442452',
      };

      const mockResponse: Response = {
        success: false,
        message: 'Failed to verify code',
      };

      jest.spyOn(otpService, 'verifyOtp').mockImplementation(() => {
        throw new Error('Error');
      });

      const res = await service.verifyCode(mockVerifyCodeRequest);

      expect(otpService.verifyOtp).toHaveBeenCalled();
      expect(res).toEqual(mockResponse);
    });
  });
});
