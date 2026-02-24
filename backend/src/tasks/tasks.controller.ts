import {
    Controller,
    Get,
    Post,
    Patch,
    Delete,
    Body,
    Param,
    Query,
    UseGuards,
    UsePipes,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto, createTaskSchema } from './dto/create-task.dto';
import { UpdateTaskDto, updateTaskSchema } from './dto/update-task.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { CurrentUser, JwtUser } from '../common/decorators/current-user.decorator';
import { OrganizationId } from '../common/decorators/organization.decorator';
import { ZodValidationPipe } from '../common/pipes/zod-validation.pipe';
import { MemberRole } from '@prisma/client';

@Controller('tasks')
@UseGuards(JwtAuthGuard)
export class TasksController {
    constructor(private readonly tasksService: TasksService) { }

    @Get()
    async list(
        @OrganizationId() orgId: string,
        @Query('cursor') cursor?: string,
        @Query('limit') limit?: string,
    ) {
        return this.tasksService.list(orgId, cursor, limit ? parseInt(limit, 10) : undefined);
    }

    @Post()
    @UsePipes(new ZodValidationPipe(createTaskSchema))
    async create(
        @OrganizationId() orgId: string,
        @CurrentUser() user: JwtUser,
        @Body() dto: CreateTaskDto,
    ) {
        return this.tasksService.create(orgId, user.userId, dto);
    }

    @Get('search')
    async search(
        @OrganizationId() orgId: string,
        @Query('q') query: string,
        @Query('limit') limit?: string,
    ) {
        return this.tasksService.search(orgId, query, limit ? parseInt(limit, 10) : undefined);
    }

    @Get('filter')
    async filterMetadata(
        @OrganizationId() orgId: string,
        @Query('metadata') metadata: string,
    ) {
        let filter: Record<string, unknown>;
        try {
            filter = JSON.parse(metadata);
        } catch {
            filter = {};
        }
        return this.tasksService.filterByMetadata(orgId, filter);
    }

    @Get(':id')
    async findById(@OrganizationId() orgId: string, @Param('id') id: string) {
        return this.tasksService.findById(id, orgId);
    }

    @Patch(':id')
    @UsePipes(new ZodValidationPipe(updateTaskSchema))
    async update(
        @OrganizationId() orgId: string,
        @Param('id') id: string,
        @Body() dto: UpdateTaskDto,
    ) {
        return this.tasksService.update(id, orgId, dto);
    }

    @Delete(':id')
    @UseGuards(RolesGuard)
    @Roles(MemberRole.ADMIN)
    async delete(@OrganizationId() orgId: string, @Param('id') id: string) {
        return this.tasksService.delete(id, orgId);
    }
}
