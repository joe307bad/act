import { Mock } from 'mockingbird-ts';

export class CreateCheckinSeed {
  @Mock((faker) => faker.lorem.sentences(3))
  note: string;
  @Mock((faker) => faker.datatype.number(4))
  numberOfAchievements: number;
  @Mock((faker) => faker.datatype.number(4))
  numberOfUsers: number;
  @Mock((faker) => faker.datatype.boolean())
  approved: boolean;
}
