import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';

import { of, take } from 'rxjs';

import { AxiosResponse } from 'axios';

import { OtpService } from './otp.service';

import {
  GenerateOtpRequest,
  VerifyOtpRequest,
  OtpResponse,
} from '@laze/nestjs-arkesel';

describe('OtpService', () => {
  const mockHttpService = () => ({
    post: jest.fn(),
  });

  const mockConfigService = () => ({
    get: jest.fn(),
  });

  let service: OtpService;
  let httpService: HttpService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OtpService,
        { provide: HttpService, useFactory: mockHttpService },
        { provide: ConfigService, useFactory: mockConfigService },
      ],
    }).compile();

    service = module.get<OtpService>(OtpService);
    httpService = module.get<HttpService>(HttpService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('generateOtp', () => {
    it('should call HttpService.post with right parameters', async () => {
      const mockGenerateOtpRequest: GenerateOtpRequest = {
        senderId: 'Oak',
        message: 'Your OTP is %otp_code%',
        expiry: 5,
        length: 6,
        medium: 'sms',
        type: 'alphanumeric',
        number: '233202442452',
      };

      const mockAxiosResponse: AxiosResponse = {
        data: {
          code: '1100',
          message: 'Successful',
        },
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {},
      };

      const postUrl = '/api/otp/generate';

      jest
        .spyOn(httpService, 'post')
        .mockImplementationOnce(() => of(mockAxiosResponse));

      service
        .generateOtp(mockGenerateOtpRequest)
        .pipe(take(1))
        .subscribe((_) => {
          expect(httpService.post).toHaveBeenCalledWith(postUrl, {
            ...mockGenerateOtpRequest,
            sender_id: mockGenerateOtpRequest.senderId,
          });
          expect(httpService.post).toBeCalledTimes(1);
          expect(httpService.post).toHaveNthReturnedWith(
            1,
            of(mockAxiosResponse)
          );
        });
    });

    it('should return a successful response', async () => {
      const mockGenerateOtpRequest: GenerateOtpRequest = {
        senderId: 'Oak',
        message: 'Your OTP is %otp_code%',
        expiry: 5,
        length: 6,
        medium: 'sms',
        type: 'alphanumeric',
        number: '233202442452',
      };

      const mockAxiosResponse: AxiosResponse = {
        data: {
          code: '1100',
          message: 'Successful',
        },
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {},
      };

      const mockResponse: OtpResponse = {
        success: true,
        message: mockAxiosResponse.data.message,
      };

      jest
        .spyOn(httpService, 'post')
        .mockImplementationOnce(() => of(mockAxiosResponse));

      service
        .generateOtp(mockGenerateOtpRequest)
        .pipe(take(1))
        .subscribe((response) => {
          expect(httpService.post).toHaveBeenCalled();
          expect(response).toEqual(mockResponse);
        });
    });

    it('should return a failed response', async () => {
      const mockGenerateOtpRequest: GenerateOtpRequest = {
        senderId: 'Oak',
        message: 'Your OTP is %otp_code%',
        expiry: 5,
        length: 6,
        medium: 'sms',
        type: 'alphanumeric',
        number: '23300202442452',
      };

      const mockAxiosResponse: AxiosResponse = {
        data: {
          code: '1005',
          message: 'Invalid phone number',
        },
        status: 422,
        statusText: 'UNPROCESSABLE ENTITY',
        headers: {},
        config: {},
      };

      const mockResponse: OtpResponse = {
        success: false,
        message: mockAxiosResponse.data.message,
      };

      jest
        .spyOn(httpService, 'post')
        .mockImplementationOnce(() => of(mockAxiosResponse));

      service
        .generateOtp(mockGenerateOtpRequest)
        .pipe(take(1))
        .subscribe((response) => {
          expect(httpService.post).toHaveBeenCalled();
          expect(response).toEqual(mockResponse);
        });
    });
  });

  describe('verifyOtp', () => {
    it('should call HttpService.post with right parameters', async () => {
      const mockVerifyOtpRequest: VerifyOtpRequest = {
        code: '123456',
        number: '233202442452',
      };

      const mockAxiosResponse: AxiosResponse = {
        data: {
          code: '1100',
          message: 'Successful',
        },
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {},
      };

      const postUrl = '/api/otp/verify';

      jest
        .spyOn(httpService, 'post')
        .mockImplementationOnce(() => of(mockAxiosResponse));

      service
        .verifyOtp(mockVerifyOtpRequest)
        .pipe(take(1))
        .subscribe((_) => {
          expect(httpService.post).toHaveBeenCalledWith(postUrl, {
            ...mockVerifyOtpRequest,
          });
          expect(httpService.post).toBeCalledTimes(1);
          expect(httpService.post).toHaveNthReturnedWith(
            1,
            of(mockAxiosResponse)
          );
        });
    });

    it('should return a successful response', async () => {
      const mockVerifyOtpRequest: VerifyOtpRequest = {
        code: '123456',
        number: '233202442452',
      };

      const mockAxiosResponse: AxiosResponse = {
        data: {
          code: '1100',
          message: 'Successful',
        },
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {},
      };

      const mockResponse: OtpResponse = {
        success: true,
        message: mockAxiosResponse.data.message,
      };

      jest
        .spyOn(httpService, 'post')
        .mockImplementationOnce(() => of(mockAxiosResponse));

      service
        .verifyOtp(mockVerifyOtpRequest)
        .pipe(take(1))
        .subscribe((response) => {
          expect(httpService.post).toHaveBeenCalled();
          expect(response).toEqual(mockResponse);
        });
    });

    it('should return a failed response', async () => {
      const mockVerifyOtpRequest: VerifyOtpRequest = {
        code: null,
        number: '233202442452',
      };

      const mockAxiosResponse: AxiosResponse = {
        data: {
          code: '1101',
          message: 'The code field is required.',
        },
        status: 422,
        statusText: 'UNPROCESSABLE ENTITY',
        headers: {},
        config: {},
      };

      const mockResponse: OtpResponse = {
        success: false,
        message: mockAxiosResponse.data.message,
      };

      jest
        .spyOn(httpService, 'post')
        .mockImplementationOnce(() => of(mockAxiosResponse));

      service
        .verifyOtp(mockVerifyOtpRequest)
        .pipe(take(1))
        .subscribe((response) => {
          expect(httpService.post).toHaveBeenCalled();
          expect(response).toEqual(mockResponse);
        });
    });
  });
});
