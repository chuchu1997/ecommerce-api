export class CreateCategoryDto {
  name: string;

  slug: string;

  description: string;

  parentId?: number;
}
