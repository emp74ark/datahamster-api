import { Injectable } from '@nestjs/common';
import process from 'node:process';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }

  private uptimeFormat(uptime: number) {
    const days = Math.floor(uptime / (24 * 60 * 60));
    const hours = Math.floor((uptime % (24 * 60 * 60)) / (60 * 60));
    const minutes = Math.floor((uptime % (60 * 60)) / 60);
    const seconds = Math.floor(uptime % 60);
    return `${days}d ${hours}h ${minutes}m ${seconds}s`;
  }

  health(): Record<string, string> {
    const uptime = process.uptime();
    return {
      status: 'alive',
      version: '0.0.1',
      uptime: this.uptimeFormat(uptime),
    };
  }
}
