import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    cors: {
      origin: '*',
    },
    bodyParser: false,
  });

  const configService = app.get(ConfigService);

  const server = await app.listen(+configService.get<string>('port'));
  server.setTimeout(1200000);
}
bootstrap();
