import { field, relation } from '@nozbe/watermelondb/decorators';
import { Associations } from '@nozbe/watermelondb/Model';
import { BaseModel } from './base-model';

export class CheckinUser extends BaseModel {
  static table = 'checkin_users';
  static associations: Associations = {
    checkins: { type: 'belongs_to', key: 'checkin_id' },
    users: { type: 'belongs_to', key: 'user_id' }
  };
  @field('checkin_id') checkinId: string;
  @field('user_id') userId: string;
}
