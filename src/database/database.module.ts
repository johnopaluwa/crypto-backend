import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CryptoData, CryptoSchema } from './crypto-schema';
import { CryptoController } from './crypto.controller';
import { CryptoService } from './crypto.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: CryptoData.name, schema: CryptoSchema },
    ]),
  ],
  controllers: [CryptoController],
  providers: [CryptoService],
})
export class DatabaseModule {}
