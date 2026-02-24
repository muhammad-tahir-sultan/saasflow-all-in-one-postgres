import { Injectable, UnauthorizedException, ConflictException, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';
import { jwtConfig } from '../config/jwt.config';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { JwtPayload } from '../common/types/jwt-payload.type';

@Injectable()
export class AuthService {
    private readonly logger = new Logger(AuthService.name);

    constructor(
        private prisma: PrismaService,
        private jwtService: JwtService,
    ) { }

    async register(dto: RegisterDto) {
        // Check if user already exists
        const existingUser = await this.prisma.user.findUnique({
            where: { email: dto.email },
        });

        if (existingUser) {
            throw new ConflictException('Email already registered');
        }

        // Hash password
        const passwordHash = await bcrypt.hash(dto.password, 12);

        // Create user + default organization in a transaction
        const result = await this.prisma.$transaction(async (tx) => {
            // Create user
            const user = await tx.user.create({
                data: {
                    email: dto.email,
                    passwordHash,
                    name: dto.name,
                },
            });

            // Create default organization
            const orgName = dto.organizationName || `${dto.name}'s Organization`;
            const slug = orgName
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, '-')
                .replace(/^-|-$/g, '');

            const organization = await tx.organization.create({
                data: {
                    name: orgName,
                    slug: `${slug}-${user.id.substring(0, 8)}`,
                },
            });

            // Add user as admin of the org
            await tx.organizationMember.create({
                data: {
                    organizationId: organization.id,
                    userId: user.id,
                    role: 'ADMIN',
                },
            });

            return { user, organization };
        });

        // Generate tokens
        const tokens = await this.generateTokens({
            userId: result.user.id,
            email: result.user.email,
        });

        // Store refresh token hash
        await this.updateRefreshToken(result.user.id, tokens.refreshToken);

        this.logger.log(`User registered: ${dto.email}`);

        return {
            user: {
                id: result.user.id,
                email: result.user.email,
                name: result.user.name,
            },
            organization: {
                id: result.organization.id,
                name: result.organization.name,
                slug: result.organization.slug,
            },
            ...tokens,
        };
    }

    async login(dto: LoginDto) {
        const user = await this.prisma.user.findUnique({
            where: { email: dto.email },
            include: {
                memberships: {
                    include: { organization: true },
                },
            },
        });

        if (!user) {
            throw new UnauthorizedException('Invalid credentials');
        }

        const isPasswordValid = await bcrypt.compare(dto.password, user.passwordHash);
        if (!isPasswordValid) {
            throw new UnauthorizedException('Invalid credentials');
        }

        const tokens = await this.generateTokens({
            userId: user.id,
            email: user.email,
        });

        await this.updateRefreshToken(user.id, tokens.refreshToken);

        this.logger.log(`User logged in: ${dto.email}`);

        return {
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
            },
            organizations: user.memberships.map((m) => ({
                id: m.organization.id,
                name: m.organization.name,
                slug: m.organization.slug,
                role: m.role,
            })),
            ...tokens,
        };
    }

    async refresh(userId: string, refreshToken: string) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
        });

        if (!user || !user.refreshToken) {
            throw new UnauthorizedException('Access denied');
        }

        const isRefreshValid = await bcrypt.compare(refreshToken, user.refreshToken);
        if (!isRefreshValid) {
            throw new UnauthorizedException('Access denied');
        }

        const tokens = await this.generateTokens({
            userId: user.id,
            email: user.email,
        });

        await this.updateRefreshToken(user.id, tokens.refreshToken);

        return tokens;
    }

    async logout(userId: string) {
        await this.prisma.user.update({
            where: { id: userId },
            data: { refreshToken: null },
        });
    }

    private async generateTokens(payload: JwtPayload) {
        const [accessToken, refreshToken] = await Promise.all([
            this.jwtService.signAsync(payload, {
                secret: jwtConfig.accessSecret,
                expiresIn: jwtConfig.accessExpiry,
            }),
            this.jwtService.signAsync(payload, {
                secret: jwtConfig.refreshSecret,
                expiresIn: jwtConfig.refreshExpiry,
            }),
        ]);

        return { accessToken, refreshToken };
    }

    private async updateRefreshToken(userId: string, refreshToken: string) {
        const hash = await bcrypt.hash(refreshToken, 12);
        await this.prisma.user.update({
            where: { id: userId },
            data: { refreshToken: hash },
        });
    }
}
