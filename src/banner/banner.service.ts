import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateBannerDTO } from './dto/create-banner.dto';
import { UpdateBannerDto } from './dto/update-banner.dto';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class BannerService {
  constructor(private prisma: PrismaService) {}
  async create(createBannerDto: CreateBannerDTO) {
    const { ...data } = createBannerDto;
    return await this.prisma.banner.create({
      data,
    });
  }

  async findAll() {
    return await this.prisma.banner.findMany({});
  }

  async findOne(id: number) {
    return await this.prisma.banner.findUnique({
      where: {
        id,
      },
    });
  }

  async update(id: number, updateBannerDto: UpdateBannerDto) {
    const { position, ...data } = updateBannerDto;
    const existBanner = await this.prisma.banner.findUnique({
      where: { id },
    });
    if (!existBanner) {
      throw new BadRequestException(`Banner với ID:${id} không tồn tại `);
    }
    if (position !== undefined && position !== existBanner.position) {
      // Determine which banners need position adjustments
      if (position < existBanner.position) {
        // Nếu position giảm, tăng position của các banner có position >= new position

        await this.prisma.banner.updateMany({
          where: {
            position: {
              gte: position,
              lt: existBanner.position,
            },
          },
          data: {
            position: { increment: 1 },
          },
        });
      } else {
        // When moving a banner to a later position:
        // Nếu position tăng, giảm position của các banner có position > new position

        await this.prisma.banner.updateMany({
          where: {
            position: {
              gt: existBanner.position,
              lte: position,
            },
          },
          data: {
            position: { decrement: 1 },
          },
        });
      }
    }

    // Update the banner with new data
    const updatedBanner = await this.prisma.banner.update({
      where: { id },
      data: {
        ...data,
        position: position ?? existBanner.position, // Keep old position if not provided
        updatedAt: new Date(),
      },
    });
    return updatedBanner;
  }

  remove(id: number) {
    return `This action removes a #${id} banner`;
  }
}
