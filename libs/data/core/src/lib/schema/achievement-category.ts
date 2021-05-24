import {
  date,
  field,
  readonly
} from '@nozbe/watermelondb/decorators';
import { BaseModel } from './base-model';

export class AchievementCategory extends BaseModel {
  static table = 'achievement_categories';
  @field('name') name: string;
}
