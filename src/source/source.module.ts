import { Module } from '@nestjs/common';
import { SourceService } from './source.service';
import { SourceController } from './source.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Source } from './entities/source.entity';
import { SourceResolver } from './source.resolver';

@Module({
  imports: [TypeOrmModule.forFeature([Source])],
  controllers: [SourceController],
  providers: [SourceService, SourceResolver],
})
export class SourceModule {}
