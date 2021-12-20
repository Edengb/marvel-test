import { Controller, Post, Get, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt-auth.guard';
import { LocalAuthGuard } from './local-auth.guard';
import { Payload } from './payload.interface';

@Controller('auth')
export class  AuthController {
    constructor(private readonly authService: AuthService) {}
    
    @Post()
    @UseGuards(LocalAuthGuard)
    async login(@Req() req) {
        return this.authService.login(req.user);
    }
    
    @Get()
    @UseGuards(JwtAuthGuard)    
    getAuthStatus(@Req() req) {
        return { userId: req.user._id, name: req.user.name };
    }

}
 
