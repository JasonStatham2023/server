import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { PrismaService } from './prisma.service';
import { json, urlencoded } from 'express';
import * as serveStatic from 'serve-static';
import * as path from 'path';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);
  const prismaService = app.get(PrismaService);
  await prismaService.enableShutdownHooks(app);
  app.use(json({ limit: '50mb' }));
  app.use(urlencoded({ extended: true, limit: '50mb' }));
  app.use(
    '/static',
    serveStatic(path.join(__dirname, '../../public/static'), {}),
  );
  app.enableCors();
  await app.listen(3000);
}

bootstrap();
