/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import { BadRequestException, Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';

import expressBasicAuth = require('express-basic-auth');
import { ExpressAdapter } from '@bull-board/express';
import { Queue } from 'bull';
import { BullAdapter } from '@bull-board/api/bullAdapter';
import { createBullBoard } from '@bull-board/api';
import { useContainer } from 'class-validator';

import { environment } from './environments/environment';

import { AppModule } from './app/app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const serverAdapter = new ExpressAdapter();
  serverAdapter.setBasePath('/bull-board');

  const emailQueue = app.get<Queue>(`BullQueue_email`);
  const smsQueue = app.get<Queue>(`BullQueue_sms`);

  createBullBoard({
    queues: [new BullAdapter(emailQueue), new BullAdapter(smsQueue)],
    serverAdapter,
  });

  app.use(
    '/bull-board',
    expressBasicAuth({
      users: {
        laze: 'laze2.0',
      },
      challenge: true,
    }),
    serverAdapter.getRouter()
  );

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      stopAtFirstError: true,
      exceptionFactory: (errors) => {
        let [result] = errors;
        if (!result.constraints) {
          [result] = result.children;
        }

        const [message] = Object.values(result.constraints);

        return new BadRequestException(message);
      },
    })
  );
  useContainer(app.select(AppModule), { fallbackOnErrors: true });

  const globalPrefix = 'api';
  app.setGlobalPrefix(globalPrefix);

  const port = environment.app.port;
  await app.listen(port);

  Logger.log(
    `🚀 Application is running on: http://localhost:${port}/${globalPrefix}`
  );
}

bootstrap();
