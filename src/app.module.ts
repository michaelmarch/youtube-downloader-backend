import { Module } from '@nestjs/common';
import { DownloadModule } from './download/download.module';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [DownloadModule, ScheduleModule.forRoot()],
  controllers: [],
  providers: [],
})
export class AppModule {}
