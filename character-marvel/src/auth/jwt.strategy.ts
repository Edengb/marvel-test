import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { jwtConstants } from './constants';
import { Payload } from './payload.interface';
import { UserService } from 'src/user/user.service';
import { User } from 'src/user/entities/user.entity';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private userService: UserService) {
    // super({
    //   jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),            
    //   secretOrKey: jwtConstants.secret,
    //   noTimestamp: true      
    // });
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),            
      secretOrKey: jwtConstants.secret,
      noTimestamp: false,
      expiresIn: 1000
    });
  }

  async validate(payload: Payload): Promise<User> {
    return this.userService.findById(payload.userId) ;
  }
}
