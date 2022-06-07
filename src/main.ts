import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    cors: {
      origin: '*',
    },
    bodyParser: false,
  });

  const server = await app.listen(2001);
  server.setTimeout(1200000);
}
bootstrap();
