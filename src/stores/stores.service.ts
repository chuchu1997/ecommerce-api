import { Injectable } from '@nestjs/common';
import { CreateStoreDto } from './dto/create-store.dto';
import { UpdateStoreDto } from './dto/update-store.dto';
import { UsersService } from 'src/users/users.service';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class StoresService {
  constructor(
    // private uploadService: UploadService,
    private userService: UsersService,
    private prisma: PrismaService,
  ) {}

  async create(createStoreDto: CreateStoreDto) {
    const { userID, name } = createStoreDto;
    return await this.prisma.store.create({
      data: {
        userID: userID,
        name: name,
      },
    });
  }

  findAll() {
    return `This action returns all stores`;
  }

  async findAllStoresWithUserID(userID: number) {
    return await this.prisma.store.findMany({
      where: {
        userID: userID,
      },
    });
  }

  async findOne(id: number, userId: number) {
    return await this.prisma.store.findUnique({
      where: {
        id,
        userID: userId,
      },
    });
  }

  async update(id: number, updateStoreDto: UpdateStoreDto) {
    const { name, description } = updateStoreDto;
    return await this.prisma.store.update({
      where: {
        id,
      },
      data: {
        name,
        description,
      },
    });
  }

  async remove(id: number) {
    return await this.prisma.store.delete({
      where: { id },
    });
  }
}
