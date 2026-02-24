import {
    Controller,
    Get,
    Post,
    Body,
    UseGuards,
    UsePipes,
} from '@nestjs/common';
import { JobsService } from './jobs.service';
import { CreateJobDto, createJobSchema } from './dto/create-job.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { OrganizationId } from '../common/decorators/organization.decorator';
import { ZodValidationPipe } from '../common/pipes/zod-validation.pipe';
import { MemberRole } from '@prisma/client';

@Controller('jobs')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(MemberRole.ADMIN)
export class JobsController {
    constructor(private readonly jobsService: JobsService) { }

    @Get()
    async list(@OrganizationId() orgId: string) {
        return this.jobsService.list(orgId);
    }

    @Post()
    @UsePipes(new ZodValidationPipe(createJobSchema))
    async create(@OrganizationId() orgId: string, @Body() dto: CreateJobDto) {
        return this.jobsService.enqueue(orgId, dto);
    }
}
