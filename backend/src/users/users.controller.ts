import { Controller, Get, Patch, Body, UseGuards, UsePipes } from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto, updateUserSchema } from './dto/update-user.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser, JwtUser } from '../common/decorators/current-user.decorator';
import { ZodValidationPipe } from '../common/pipes/zod-validation.pipe';

@Controller('users')
@UseGuards(JwtAuthGuard)
export class UsersController {
    constructor(private readonly usersService: UsersService) { }

    @Get('me')
    async getProfile(@CurrentUser() user: JwtUser) {
        return this.usersService.findById(user.userId);
    }

    @Patch('me')
    @UsePipes(new ZodValidationPipe(updateUserSchema))
    async updateProfile(@CurrentUser() user: JwtUser, @Body() dto: UpdateUserDto) {
        return this.usersService.update(user.userId, dto);
    }
}
