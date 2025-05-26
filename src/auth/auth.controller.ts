import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
  UseGuards,
  Request,
  Logger,
} from '@nestjs/common';
import { AuthService } from './auth.service';

import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

import { LoginDTO } from './dto/login.dto';
import { Public } from './decorators/public.decorator';
import { RegisterDto } from './dto/register.dto';
import { LocalAuthGuard } from './guards/local.guard';
import { SkipThrottle, Throttle } from '@nestjs/throttler';
import { MyLogger } from 'src/utils/logger.service';
import { ForgotPasswordDto } from './dto/forgotPassword.dto';
import { ResetPasswordDto } from './dto/resetPassword.dto';
// @SkipThrottle()
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly logger: MyLogger,
  ) {}
  @Public()
  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Request() req): Promise<any> {
    return {
      message: '✅ Đăng nhập thành công ✅',
      user: req.user,
      accessToken: await this.authService.generateAccessToken(req.user), // nếu có JWT
    };
    // return await this.authService.validateUser(email, password);
  }

  @Public()
  @Post('register')
  async register(@Body() registerDto: RegisterDto) {
    return {
      message: '✅ Đăng ký thành công ✅',
      accessToken: await this.authService.register(registerDto),
    };
  }

  @SkipThrottle()
  @Get('profile')
  getProfile(@Request() req) {
    // req.user chính là payload hoặc user bạn return trong validate()
    return {
      message: '✅ Đây là thông tin của user ✅',
      user: req.user,
    };
  }
  @Public()
  @Post('forgot')
  async forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto) {
    return {
      message: `✅ Đã gửi link lấy lại mật khẩu ở Email ${forgotPasswordDto.email} ✅`,

      newPassword: await this.authService.forgotPassword(forgotPasswordDto),
    };
  }

  @Public()
  @Post('reset-password')
  async resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
    await this.authService.resetPassword(resetPasswordDto);
    return {
      message: '✅ Đã lấy lại mật khẩu thành công  ✅',
    };
  }
}
