import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { User } from 'src/user/entities/user.entity';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({ usernameField: 'login' })
  }

  async validate(login: string, password: string): Promise<User> {
    const user: User = await this.authService.validateUser(login, password);
    // if (!user) {
    //   // Custom login fail 
    //   throw new UnauthorizedException();
    // }
    return user;
  }
}