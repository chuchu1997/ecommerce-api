import { Injectable } from '@nestjs/common';
import { CreateFakecommentDto } from './dto/create-fakecomment.dto';
import { UpdateFakecommentDto } from './dto/update-fakecomment.dto';
import { FakeCommentQueryDto } from './dto/fake-filter.dto';
import { ProductsService } from 'src/products/products.service';

@Injectable()
export class FakecommentsService {
  constructor(private productService: ProductsService) {}
  create(createFakecommentDto: CreateFakecommentDto) {
    return 'This action adds a new fakecomment';
  }

  findAll(query: FakeCommentQueryDto) {
    // const { productID } = query;
    // this.productService.findOne(productID);
    return `This action returns all fakecomments`;
  }

  findOne(id: number) {
    return `This action returns a #${id} fakecomment`;
  }

  update(id: number, updateFakecommentDto: UpdateFakecommentDto) {
    return `This action updates a #${id} fakecomment`;
  }

  remove(id: number) {
    return `This action removes a #${id} fakecomment`;
  }
}
