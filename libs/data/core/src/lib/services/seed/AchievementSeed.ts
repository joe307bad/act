import { Mock } from 'mockingbird-ts';

export enum Categories {
  Category1 = 'Category 1',
  Category2 = 'Category 2',
  Category3 = 'Category 3',
  Category4 = 'Category 4'
}

export class AchievementSeed {
  @Mock((faker) => faker.hacker.phrase())
  readonly name: string;

  @Mock()
  readonly points: number;

  @Mock()
  readonly photo: string;

  @Mock()
  readonly description: string;

  @Mock({ enum: Categories })
  readonly category: string;
}
