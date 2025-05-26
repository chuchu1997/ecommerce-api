import { ConflictException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
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
          address: address,
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
  async findResetTokenOfUser(resetToken: string) {
    return await this.prisma.user.findUnique({
      where: {
        resetToken,
        resetTokenExpiry: {
          gt: new Date(), // gt = greater than
        },
      },
    });
  }
  async clearResetToken(userId: number) {
    return await this.prisma.user.update({
      where: { id: userId },
      data: {
        resetToken: null,
        resetTokenExpiry: null,
      },
    });
  }
  async updatePassword(userId: number, hashedPassword: string) {
    return await this.prisma.user.update({
      where: { id: userId },
      data: {
        password: hashedPassword,
      },
    });
  }
  async updateResetToken(
    userId: number,
    resetToken: string,
    resetTokenExpiry: Date,
  ): Promise<void> {
    await this.prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        resetToken: resetToken,
        resetTokenExpiry: resetTokenExpiry,
      },
    });
    // await this.prisma.user.update(userId, {
    //   resetToken,
    //   resetTokenExpiry,
    // });
  }
}
