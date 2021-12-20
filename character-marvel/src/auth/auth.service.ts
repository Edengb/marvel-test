import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/user/entities/user.entity';
import { UserService } from 'src/user/user.service';
import { jwtConstants } from './constants';
import { Payload } from './payload.interface';

@Injectable()
export class AuthService {
    constructor(private userService: UserService,
      private jwtService: JwtService
    ) {}
    
    async validateUser(login: string, password: string): Promise<User> {
      const user: User = await this.userService.findByLogin(login);
      if (user && user.password === password) {
        return user;
      }
      return null;
    }

    login(user: User) {
      const payload: Payload = { userId: user._id.toHexString(), name: user.name };
      return {
        // token: this.jwtService.sign(payload, { secret: jwtConstants.secret, noTimestamp: true })
        accessToken: this.jwtService.sign(payload, { secret: jwtConstants.secret, noTimestamp: false, expiresIn: 1000 })
      };
    }
}
