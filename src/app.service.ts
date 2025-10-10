import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  health(): Record<string, string> {
    return {
      status: 'alive',
      version: '0.0.1',
    };
  }
}
