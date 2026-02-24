import { Injectable, NotFoundException, ConflictException, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateOrganizationDto } from './dto/create-organization.dto';
import { InviteMemberDto } from './dto/invite-member.dto';
import { MemberRole } from '@prisma/client';

@Injectable()
export class OrganizationsService {
    private readonly logger = new Logger(OrganizationsService.name);

    constructor(private prisma: PrismaService) { }

    async create(dto: CreateOrganizationDto, userId: string) {
        const slug = dto.slug || dto.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

        const organization = await this.prisma.$transaction(async (tx) => {
            const org = await tx.organization.create({
                data: { name: dto.name, slug },
            });

            await tx.organizationMember.create({
                data: {
                    organizationId: org.id,
                    userId,
                    role: 'ADMIN',
                },
            });

            return org;
        });

        this.logger.log(`Organization created: ${organization.name}`);
        return organization;
    }

    async findById(id: string) {
        return this.prisma.withTenant(id, async (tx) => {
            const org = await tx.organization.findUnique({
                where: { id },
                include: {
                    members: {
                        include: { user: { select: { id: true, email: true, name: true } } },
                    },
                    _count: { select: { tasks: true, jobs: true } },
                },
            });

            if (!org) throw new NotFoundException('Organization not found');
            return org;
        });
    }

    async inviteMember(organizationId: string, dto: InviteMemberDto) {
        const user = await this.prisma.user.findUnique({
            where: { email: dto.email },
        });

        if (!user) throw new NotFoundException('User not found with this email');

        const existing = await this.prisma.organizationMember.findUnique({
            where: { organizationId_userId: { organizationId, userId: user.id } },
        });

        if (existing) throw new ConflictException('User is already a member');

        const membership = await this.prisma.organizationMember.create({
            data: {
                organizationId,
                userId: user.id,
                role: dto.role,
            },
            include: { user: { select: { id: true, email: true, name: true } } },
        });

        this.logger.log(`Member invited: ${dto.email} to org ${organizationId}`);
        return membership;
    }

    async updateMemberRole(organizationId: string, userId: string, role: MemberRole) {
        const membership = await this.prisma.organizationMember.findUnique({
            where: { organizationId_userId: { organizationId, userId } },
        });

        if (!membership) throw new NotFoundException('Member not found');

        return this.prisma.organizationMember.update({
            where: { id: membership.id },
            data: { role },
        });
    }

    async removeMember(organizationId: string, userId: string) {
        const membership = await this.prisma.organizationMember.findUnique({
            where: { organizationId_userId: { organizationId, userId } },
        });

        if (!membership) throw new NotFoundException('Member not found');

        await this.prisma.organizationMember.delete({
            where: { id: membership.id },
        });

        return { message: 'Member removed' };
    }
}
