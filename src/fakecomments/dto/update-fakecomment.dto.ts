import { PartialType } from '@nestjs/swagger';
import { CreateFakecommentDto } from './create-fakecomment.dto';

export class UpdateFakecommentDto extends PartialType(CreateFakecommentDto) {
  updatedAt: Date;
}
