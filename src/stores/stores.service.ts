import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateStoreDto } from './dto/create-store.dto';
import { UpdateStoreDto } from './dto/update-store.dto';
import { UsersService } from 'src/users/users.service';
import { PrismaService } from 'src/prisma.service';
import { UploadService } from 'src/upload/upload.service';

@Injectable()
export class StoresService {
  constructor(
    private uploadService: UploadService,
    private userService: UsersService,
    private prisma: PrismaService,
  ) {}

  async create(createStoreDto: CreateStoreDto) {
    const { userID, name, socials } = createStoreDto;

    return await this.prisma.store.create({
      data: {
        userID: userID,
        name: name,
        socials:
          socials && socials.length > 0
            ? {
                createMany: {
                  data: socials.map((social) => ({
                    type: social.type,
                    url: social.url,
                  })),
                },
              }
            : undefined,
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
      include: {
        socials: true,
      },
    });
  }

  async findOne(id: number) {
    let store = await this.prisma.store.findUnique({
      where: {
        id,
      },
      include: {
        socials: true,
      },
    });
    console.log('STORE', store);
    return store;
  }

  async update(id: number, updateStoreDto: UpdateStoreDto) {
    // Exclude userID from dataUpdate to avoid Prisma type errors
    const { logo, favicon, socials, userID, ...dataUpdate } = updateStoreDto;

    const existStore = await this.prisma.store.findUnique({
      where: {
        id,
      },
      select: {
        socials: true,
        logo: true,
        favicon: true,
      },
    });
    if (!existStore) {
      throw new NotFoundException(
        `⚠️⚠️⚠️Store với ID ${id} không tồn tại thao tác ⚠️⚠️⚠️ `,
      );
    }
    const isLogoUpdate = logo && logo !== existStore.logo;
    const isFavUpdate = favicon && favicon != existStore.favicon;

    if (isLogoUpdate && existStore.logo) {
      await this.uploadService.deleteImagesFromS3(existStore.logo);
    }
    if (isFavUpdate && existStore.favicon) {
      await this.uploadService.deleteImagesFromS3(existStore.favicon);
    }
    // const isSocialsUpdate =
    //   socials &&
    //   JSON.stringify(socials) !== JSON.stringify(existStore?.socials);

    return await this.prisma.store.update({
      where: {
        id,
      },
      data: {
        ...dataUpdate,
        ...(socials !== undefined && {
          socials: {
            deleteMany: {},
            createMany: {
              data: socials.map((social) => ({
                type: social.type,
                url: social.url,
              })),
            },
          },
        }),

        logo: logo,
        favicon: favicon,
        name: dataUpdate.name ?? '',
        description: dataUpdate.description ?? '',
        ...(dataUpdate.seo !== undefined && {
          seo: dataUpdate.seo as any, // Cast to 'any' or 'Prisma.InputJsonValue'
        }),
      },
    });
  }

  async remove(id: number) {
    const existStore = await this.prisma.store.findUnique({
      where: {
        id,
      },
      select: {
        socials: true,
        logo: true,
        favicon: true,
      },
    });
    if (!existStore) {
      throw new NotFoundException(
        `⚠️⚠️⚠️Store với ID ${id} không tồn tại thao tác ⚠️⚠️⚠️ `,
      );
    }

    if (existStore.logo) {
      await this.uploadService.deleteImagesFromS3(existStore.logo);
    }
    if (existStore.favicon) {
      await this.uploadService.deleteImagesFromS3(existStore.favicon);
    }

    await this.prisma.store.update({
      where: { id },
      data: {
        socials: {
          deleteMany: {},
        },
      },
    });
    return await this.prisma.store.delete({
      where: { id },
    });
  }
}
