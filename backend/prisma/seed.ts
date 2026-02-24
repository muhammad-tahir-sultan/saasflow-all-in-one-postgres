import { PrismaClient, MemberRole, TaskStatus, JobStatus } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
    console.log('🌱 Seeding database...');

    // Clean existing data
    await prisma.job.deleteMany();
    await prisma.task.deleteMany();
    await prisma.organizationMember.deleteMany();
    await prisma.user.deleteMany();
    await prisma.organization.deleteMany();

    // ── Organizations ──────────────────────────────────────
    const acme = await prisma.organization.create({
        data: { name: 'Acme Corp', slug: 'acme-corp' },
    });

    const beta = await prisma.organization.create({
        data: { name: 'Beta Inc', slug: 'beta-inc' },
    });

    console.log('✅ Organizations created');

    // ── Users ──────────────────────────────────────────────
    const passwordHash = await bcrypt.hash('password123', 12);

    const users = await Promise.all([
        prisma.user.create({
            data: { email: 'admin@acme.com', name: 'Alice Admin', passwordHash },
        }),
        prisma.user.create({
            data: { email: 'manager1@acme.com', name: 'Bob Manager', passwordHash },
        }),
        prisma.user.create({
            data: { email: 'manager2@acme.com', name: 'Carol Manager', passwordHash },
        }),
        prisma.user.create({
            data: { email: 'member1@acme.com', name: 'Dave Member', passwordHash },
        }),
        prisma.user.create({
            data: { email: 'member2@acme.com', name: 'Eve Member', passwordHash },
        }),
    ]);

    console.log('✅ Users created');

    // ── Memberships ────────────────────────────────────────
    const roles: MemberRole[] = ['ADMIN', 'MANAGER', 'MANAGER', 'MEMBER', 'MEMBER'];

    // All users in Acme Corp
    for (let i = 0; i < users.length; i++) {
        await prisma.organizationMember.create({
            data: {
                organizationId: acme.id,
                userId: users[i].id,
                role: roles[i],
            },
        });
    }

    // First 3 users also in Beta Inc
    for (let i = 0; i < 3; i++) {
        await prisma.organizationMember.create({
            data: {
                organizationId: beta.id,
                userId: users[i].id,
                role: roles[i],
            },
        });
    }

    console.log('✅ Memberships created');

    // ── Tasks ──────────────────────────────────────────────
    const statuses: TaskStatus[] = ['PENDING', 'IN_PROGRESS', 'COMPLETED', 'ARCHIVED'];
    const priorities = ['low', 'medium', 'high', 'critical'];
    const labels = [
        ['backend', 'urgent'],
        ['frontend'],
        ['backend', 'database'],
        ['devops', 'infrastructure'],
        ['frontend', 'design'],
        ['backend', 'api'],
    ];

    for (let i = 0; i < 50; i++) {
        const status = statuses[i % 4];
        const isCompleted = status === 'COMPLETED' || status === 'ARCHIVED';
        const orgId = i < 30 ? acme.id : beta.id;
        const assigneeIdx = i % users.length;
        const creatorIdx = (i + 1) % users.length;

        await prisma.task.create({
            data: {
                organizationId: orgId,
                title: `Task ${i + 1}: ${getTaskTitle(i)}`,
                description: `Description for task ${i + 1}. This task involves ${getTaskDescription(i)}.`,
                status,
                assigneeId: users[assigneeIdx].id,
                creatorId: users[creatorIdx].id,
                metadata: {
                    priority: priorities[i % 4],
                    labels: labels[i % labels.length],
                    customFields: {
                        sprint: Math.floor(i / 5) + 1,
                        storyPoints: (i % 8) + 1,
                    },
                    ...(i % 3 === 0 && {
                        dueDate: new Date(Date.now() + (i + 1) * 86400000).toISOString(),
                    }),
                },
                completedAt: isCompleted
                    ? new Date(Date.now() - (50 - i) * 3600000)
                    : null,
                createdAt: new Date(Date.now() - (80 - i) * 86400000),
            },
        });
    }

    console.log('✅ 50 Tasks created');

    // ── Jobs ───────────────────────────────────────────────
    const jobTypes = ['weekly_summary', 'auto_archive'];
    const jobStatuses: JobStatus[] = [
        'PENDING', 'PENDING', 'PENDING', 'PENDING', 'PENDING',
        'COMPLETED', 'COMPLETED', 'COMPLETED',
        'FAILED', 'FAILED',
    ];

    for (let i = 0; i < 10; i++) {
        await prisma.job.create({
            data: {
                organizationId: i < 6 ? acme.id : beta.id,
                type: jobTypes[i % 2],
                status: jobStatuses[i],
                payload: { triggeredBy: 'seed', index: i },
                attempts: jobStatuses[i] === 'FAILED' ? 3 : jobStatuses[i] === 'COMPLETED' ? 1 : 0,
                scheduledAt: new Date(Date.now() - i * 3600000),
                ...(jobStatuses[i] === 'COMPLETED' && {
                    startedAt: new Date(Date.now() - i * 3600000 + 1000),
                    completedAt: new Date(Date.now() - i * 3600000 + 5000),
                }),
                ...(jobStatuses[i] === 'FAILED' && {
                    error: 'Simulated failure for seed data',
                }),
            },
        });
    }

    console.log('✅ 10 Jobs created');
    console.log('🎉 Seeding complete!');
}

function getTaskTitle(index: number): string {
    const titles = [
        'Implement user authentication',
        'Design database schema',
        'Create API endpoints',
        'Build dashboard UI',
        'Set up CI/CD pipeline',
        'Write unit tests',
        'Optimize query performance',
        'Add real-time notifications',
        'Implement search feature',
        'Create onboarding flow',
        'Fix pagination bug',
        'Update dependencies',
        'Add error handling',
        'Implement file upload',
        'Create analytics dashboard',
        'Refactor codebase',
        'Add rate limiting',
        'Implement caching layer',
        'Create documentation',
        'Deploy to production',
    ];
    return titles[index % titles.length];
}

function getTaskDescription(index: number): string {
    const descriptions = [
        'setting up JWT-based authentication with refresh tokens',
        'defining models and relationships for the multi-tenant architecture',
        'creating RESTful endpoints with proper validation',
        'building responsive components with Tailwind CSS',
        'configuring GitHub Actions for automated testing and deployment',
        'achieving 80%+ code coverage with comprehensive tests',
        'analyzing slow queries with EXPLAIN ANALYZE',
        'implementing WebSocket connections for live updates',
        'building full-text search with PostgreSQL tsvector',
        'creating a step-by-step guide for new users',
    ];
    return descriptions[index % descriptions.length];
}

main()
    .catch((e) => {
        console.error('❌ Seed error:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
