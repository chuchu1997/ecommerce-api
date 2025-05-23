import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AuthService } from '../auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  private readonly logger = new Logger(LocalStrategy.name);
  constructor(private authService: AuthService) {
    super({
      usernameField: 'email', // Make sure this matches your DTO
      passwordField: 'password', // Make sure this matches your DTO
      passReqToCallback: true,
    });
    this.logger.debug('LocalStrategy initialized');
  }
  async validate(email: string, password: string) {
    this.logger.debug(`LocalStrategy validate called with username: ${email}`);

    console.log('CALL VALIDATE IN LOCAL STRATEGY !!!');
    const user = await this.authService.validateUser(email, password);
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
    // const user = await this.authService.validateUser(email, password);
    // if (!user) {
    //   throw new UnauthorizedException('Invalid credentials');
    // }
    // return user;
  }
}
