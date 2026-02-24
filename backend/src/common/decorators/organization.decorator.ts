import { createParamDecorator, ExecutionContext, BadRequestException } from '@nestjs/common';

export const OrganizationId = createParamDecorator(
    (_data: unknown, ctx: ExecutionContext): string => {
        const request = ctx.switchToHttp().getRequest();
        const orgId = request.headers['x-organization-id'] as string;
        if (!orgId) {
            throw new BadRequestException('x-organization-id header is required');
        }
        return orgId;
    },
);
