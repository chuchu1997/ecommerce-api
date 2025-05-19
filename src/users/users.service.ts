import { ConflictException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { CreateUserDTO } from './dto/create-user.dto';
import { RegisterDto } from 'src/auth/dto/register.dto';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async create(createUserDTO: RegisterDto) {
    const { address, ...data } = createUserDTO;

    try {
      const user = await this.prisma.user.create({
        data: {
          email: data.email,
          password: data.password,
          name: data.name,
          phone: data.phone,
          addresses: address,
        },
      });

      return user;
    } catch (err) {
      throw new ConflictException('Email đã tồn tại (Không tạo được) !!');
    }
  }
  async findUserByID(id: number) {
    return await this.prisma.user.findUnique({
      where: {
        id,
      },
    });
  }

  async findUniqueEmailOfUser(email: string) {
    return await this.prisma.user.findUnique({
      where: {
        email,
      },
    });
  }
}
