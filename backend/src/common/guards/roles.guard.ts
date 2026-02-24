import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { MemberRole } from '@prisma/client';
import { ROLES_KEY } from '../decorators/roles.decorator';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class RolesGuard implements CanActivate {
    constructor(
        private reflector: Reflector,
        private prisma: PrismaService,
    ) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const requiredRoles = this.reflector.getAllAndOverride<MemberRole[]>(ROLES_KEY, [
            context.getHandler(),
            context.getClass(),
        ]);

        if (!requiredRoles || requiredRoles.length === 0) {
            return true;
        }

        const request = context.switchToHttp().getRequest();
        const userId = request.user?.userId;
        const organizationId = request.headers['x-organization-id'];

        if (!userId || !organizationId) {
            throw new ForbiddenException('User or organization context missing');
        }

        const membership = await this.prisma.organizationMember.findUnique({
            where: {
                organizationId_userId: {
                    organizationId,
                    userId,
                },
            },
        });

        if (!membership) {
            throw new ForbiddenException('Not a member of this organization');
        }

        if (!requiredRoles.includes(membership.role)) {
            throw new ForbiddenException(`Requires one of: ${requiredRoles.join(', ')}`);
        }

        // Attach membership to request for downstream use
        request.membership = membership;
        return true;
    }
}
