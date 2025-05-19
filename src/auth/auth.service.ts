import { BadRequestException, Injectable } from '@nestjs/common';
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
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}
  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.usersService.findUniqueEmailOfUser(email);
    if (!user) {
      throw new BadRequestException('Không tìm thấy người dùng này !!!');
    }
    const isMatchPassword = await bcrypt.compare(password, user.password);
    if (!isMatchPassword) {
      throw new BadRequestException('Sai mật khẩu  !!!');
    }

    return user;
  }

  async login(user: any): Promise<TokenDTO> {
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
    console.log('CALL NE ', registerDTO);
    const hashedPassword = await bcrypt.hash(registerDTO.password, 10);

    const user = await this.usersService.create({
      ...registerDTO,
      password: hashedPassword,
    });
    return await this.login(user); //RETURN ACCESS TOKEN
  }
}
