import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { LoginDTO } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';
// import { CreateAuthDto } from './dto/create-auth.dto';
// import { UpdateAuthDto } from './dto/update-auth.dto';
import * as bcrypt from 'bcrypt';
import { TokenDTO } from './dto/token.dto';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
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

  async generateAccessToken(user: any): Promise<TokenDTO> {
    const payload = {
      email: user.email,
      sub: user.id,
      role: user.role,
    };

    return {
      accessToken: this.jwtService.sign(payload),
    };
  }
  async register(registerDTO: RegisterDto) {
    const hashedPassword = await bcrypt.hash(registerDTO.password, 10);

    const user = await this.usersService.create({
      ...registerDTO,
      password: hashedPassword,
    });
    return await this.generateAccessToken(user); //RETURN ACCESS TOKEN
  }
}
