import { field, relation } from '@nozbe/watermelondb/decorators';
import { Associations } from '@nozbe/watermelondb/Model';
import { Achievement } from './achievement';
import { BaseModel } from './base-model';
import { Checkin } from './checkin';

export class CheckinAchievement extends BaseModel {
  static table = 'checkin_achievements';
  static associations: Associations = {
    checkins: { type: 'belongs_to', key: 'checkin_id' },
    achievements: { type: 'belongs_to', key: 'achievement_id' }
  };
  @field('checkin_id') checkinId: string;
  @field('achievement_id') achievementId: string;
}
