import {
  date,
  field,
  readonly,
  relation
} from '@nozbe/watermelondb/decorators';
import { AchievementCategory } from './achievement-category';
import { BaseModel } from './base-model';

export class Achievement extends BaseModel {
  static table = 'achievements';
  @field('name') name: string;
  @field('points') points: number;
  @field('photo') photo?: string;

  @relation('achievement_categories', 'category_id')
  category?: AchievementCategory;
}
