import { Module } from '@nestjs/common';
import { JobsController } from './jobs.controller';
import { JobsService } from './jobs.service';
import { JobsWorker } from './jobs.worker';
import { WeeklySummaryHandler } from './handlers/weekly-summary.handler';
import { AutoArchiveHandler } from './handlers/auto-archive.handler';

@Module({
    controllers: [JobsController],
    providers: [JobsService, JobsWorker, WeeklySummaryHandler, AutoArchiveHandler],
    exports: [JobsService],
})
export class JobsModule { }
