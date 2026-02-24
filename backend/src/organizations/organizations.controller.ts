import {
    Controller,
    Post,
    Get,
    Patch,
    Delete,
    Body,
    Param,
    UseGuards,
    UsePipes,
} from '@nestjs/common';
import { OrganizationsService } from './organizations.service';
import { CreateOrganizationDto, createOrganizationSchema } from './dto/create-organization.dto';
import { InviteMemberDto, inviteMemberSchema } from './dto/invite-member.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { CurrentUser, JwtUser } from '../common/decorators/current-user.decorator';
import { ZodValidationPipe } from '../common/pipes/zod-validation.pipe';
import { MemberRole } from '@prisma/client';

@Controller('organizations')
@UseGuards(JwtAuthGuard)
export class OrganizationsController {
    constructor(private readonly organizationsService: OrganizationsService) { }

    @Post()
    @UsePipes(new ZodValidationPipe(createOrganizationSchema))
    async create(@Body() dto: CreateOrganizationDto, @CurrentUser() user: JwtUser) {
        return this.organizationsService.create(dto, user.userId);
    }

    @Get(':id')
    async findById(@Param('id') id: string) {
        return this.organizationsService.findById(id);
    }

    @Post(':id/members')
    @UseGuards(RolesGuard)
    @Roles(MemberRole.ADMIN)
    @UsePipes(new ZodValidationPipe(inviteMemberSchema))
    async inviteMember(@Param('id') id: string, @Body() dto: InviteMemberDto) {
        return this.organizationsService.inviteMember(id, dto);
    }

    @Patch(':id/members/:userId')
    @UseGuards(RolesGuard)
    @Roles(MemberRole.ADMIN)
    async updateMemberRole(
        @Param('id') id: string,
        @Param('userId') userId: string,
        @Body('role') role: MemberRole,
    ) {
        return this.organizationsService.updateMemberRole(id, userId, role);
    }

    @Delete(':id/members/:userId')
    @UseGuards(RolesGuard)
    @Roles(MemberRole.ADMIN)
    async removeMember(@Param('id') id: string, @Param('userId') userId: string) {
        return this.organizationsService.removeMember(id, userId);
    }
}
