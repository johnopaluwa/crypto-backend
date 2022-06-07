import { Controller, Get } from '@nestjs/common';
import { CryptoService } from './crypto.service';

@Controller('crypto')
export class CryptoController {
  constructor(private readonly cryptoService: CryptoService) {}
  @Get()
  async getHello() {
    const data = await this.cryptoService.getData();
    return data;
  }
}
