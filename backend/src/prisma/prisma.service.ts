import { Injectable, OnModuleInit, OnModuleDestroy, Logger } from '@nestjs/common';
import { PrismaClient, Prisma } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
    private readonly logger = new Logger(PrismaService.name);

    constructor() {
        super({
            log: [
                { emit: 'event', level: 'query' },
                { emit: 'stdout', level: 'info' },
                { emit: 'stdout', level: 'warn' },
                { emit: 'stdout', level: 'error' },
            ],
        });
    }

    async onModuleInit() {
        await this.$connect();
        this.logger.log('Connected to PostgreSQL database');

        // Middleware: Soft-delete pattern (for future use)
        this.$use(async (params: Prisma.MiddlewareParams, next: (params: Prisma.MiddlewareParams) => Promise<any>) => {
            return next(params);
        });
    }

    async onModuleDestroy() {
        await this.$disconnect();
        this.logger.log('Disconnected from PostgreSQL database');
    }

    /**
     * Sets the tenant context for RLS policies.
     * Must be called within a transaction for SET LOCAL to work.
     */
    async setTenantContext(organizationId: string): Promise<void> {
        await this.$executeRawUnsafe(
            `SET LOCAL app.organization_id = '${organizationId}'`
        );
    }

    /**
     * Executes a callback within a transaction with tenant context set.
     */
    async withTenant<T>(
        organizationId: string,
        callback: (prisma: PrismaService) => Promise<T>,
    ): Promise<T> {
        return this.$transaction(async (tx) => {
            await tx.$executeRawUnsafe(
                `SET LOCAL app.organization_id = '${organizationId}'`
            );
            return callback(tx as unknown as PrismaService);
        });
    }
}
