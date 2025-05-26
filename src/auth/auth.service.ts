import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { LoginDTO } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';
// import { CreateAuthDto } from './dto/create-auth.dto';
// import { UpdateAuthDto } from './dto/update-auth.dto';
import * as bcrypt from 'bcrypt';
import { TokenDTO } from './dto/token.dto';
import { User } from '@prisma/client';
import { MyLogger } from 'src/utils/logger.service';
import { ForgotPasswordDto } from './dto/forgotPassword.dto';
import { ResetPasswordDto } from './dto/resetPassword.dto';
import { EmailService } from 'src/utils/email.service';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private logger: MyLogger,
    private emailService: EmailService,
  ) {}
  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.usersService.findUniqueEmailOfUser(email);
    if (!user) {
      this.logger.debug(`Không tìm thấy EMAIL này !!: ${email}`);
      throw new BadRequestException('Không tìm thấy người dùng này !!!');
    }

    this.logger.debug(
      `Tìm thấy email: ${email}, đang check password xem hợp lệ không ...`,
    );

    const isMatchPassword = await bcrypt.compare(password, user.password);
    if (!isMatchPassword) {
      this.logger.debug(`Sai mật khẩu ở email : ${email}`);

      throw new BadRequestException('Sai mật khẩu  !!!');
    }

    return user;

    //RETURN ACCESS TOKEN
  }

  async generateAccessToken(user: User): Promise<any> {
    const payload = {
      sub: user.id,
      email: user.email,
      name: user.name,
      phone: user.phone,
      address: user.address,
      role: user.role,
    };
    let resultGenToken = this.jwtService.sign(payload);
    return resultGenToken;

    // return {
    //   accessToken: resultGenToken,
    // };
  }
  private generateResetToken(user: User): string {
    const payload = {
      sub: user.id,
      email: user.email,
      type: 'password_reset', // Identify token type
      iat: Math.floor(Date.now() / 1000), // Issued at
    };
    return this.jwtService.sign(payload, {
      expiresIn: '10m', // Token expires in 1 hour
      // Optional: use different secret for reset tokens
      secret: process.env.JWT_SECRET,
    });
  }
  async forgotPassword(forgotPasswordDto: ForgotPasswordDto) {
    const { email } = forgotPasswordDto;
    let user = await this.usersService.findUniqueEmailOfUser(email);
    if (!user) {
      throw new BadRequestException(
        ' Email bạn nhập để lấy lại mật khẩu không tồn tại!',
      );
    }
    const resetToken = this.generateResetToken(user);

    const resetTokenExpiry = new Date();
    resetTokenExpiry.setMinutes(resetTokenExpiry.getMinutes() + 10);

    await this.usersService.updateResetToken(
      user.id,
      resetToken,
      resetTokenExpiry,
    );
    await this.emailService.sendResetLinkToEmail(
      user.email,
      resetToken,
      user.name,
    );

    // await this.emailService.sendResetPasswordEmail(
    //   user.email,
    //   resetToken,
    //   user.name,
    // );
  }

  async register(registerDTO: RegisterDto) {
    const hashedPassword = await bcrypt.hash(registerDTO.password, 10);
    const user = await this.usersService.create({
      ...registerDTO,
      password: hashedPassword,
    });
    if (user) {
      this.logger.log(`✅ Đã chấp nhận đăng ký cho người dùng ${user.email}✅`);
    }

    return await this.generateAccessToken(user); //RETURN ACCESS TOKEN
  }

  async resetPassword(resetPasswordDto: ResetPasswordDto) {
    const { token, newPassword } = resetPasswordDto;

    const decoded = this.jwtService.verify(token, {
      secret: process.env.JWT_SECRET,
    });
    if (decoded.type !== 'password_reset') {
      throw new BadRequestException('Token không hợp lệ');
    }
    const user = await this.usersService.findResetTokenOfUser(token);
    if (!user) {
      throw new BadRequestException('Token không hợp lệ hoặc đã hết hạn');
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await this.usersService.updatePassword(user.id, hashedPassword);
    await this.usersService.clearResetToken(user.id);
    await this.emailService.sendPasswordChangedNotification(
      user.email,
      user.name,
    );
    // await this.emailService.sendPasswordChangedNotification(
    //   user.email,
    //   user.name,
    // );
  }
}
