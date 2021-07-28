import { Q } from '@nozbe/watermelondb';
import {
  field,
  lazy,
  relation
} from '@nozbe/watermelondb/decorators';
import { Associations } from '@nozbe/watermelondb/Model';
import Relation from '@nozbe/watermelondb/Relation';
import { AchievementCategory } from './achievement-category';
import { BaseModel } from './base-model';
import { Checkin } from './checkin';

export class Achievement extends BaseModel {
  static table = 'achievements';

  static associations: Associations = {
    checkin_achievements: {
      type: 'has_many',
      foreignKey: 'achievement_id'
    },
    category: { type: 'belongs_to', key: 'category_id' }
  };

  @field('name') name: string;
  @field('points') points: number;
  @field('photo') photo?: string;
  @field('description') description?: string;

  @relation('achievement_categories', 'category_id')
  category?: Relation<AchievementCategory>;

  @lazy
  checkins = this.collections
    .get<Checkin>('checkins')
    .query(Q.on('checkin_achievements', 'achievement_id', this.id));
}
