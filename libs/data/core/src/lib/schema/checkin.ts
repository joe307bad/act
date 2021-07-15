import { Q } from '@nozbe/watermelondb';
import { field, lazy } from '@nozbe/watermelondb/decorators';
import { Associations } from '@nozbe/watermelondb/Model';
import { Achievement } from './achievement';
import { BaseModel } from './base-model';
import { User } from './user';

export class Checkin extends BaseModel {
  static table = 'checkins';

  static associations: Associations = {
    checkin_achievements: {
      type: 'has_many',
      foreignKey: 'checkin_id'
    },
    checkin_users: {
      type: 'has_many',
      foreignKey: 'checkin_id'
    }
  };

  @field('name') name: string;
  @field('photo') photo: string;
  @field('note') note: string;
  @field('approved') approved: boolean;

  @lazy
  achievements = this.collections
    .get<Achievement>('achievements')
    .query(Q.on('checkin_achievements', 'checkin_id', this.id));

  @lazy
  users = this.collections
    .get<User>('users')
    .query(Q.on('checkin_users', 'checkin_id', this.id));
}
