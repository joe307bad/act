import { Q } from '@nozbe/watermelondb';
import { field, lazy } from '@nozbe/watermelondb/decorators';
import { Associations } from '@nozbe/watermelondb/Model';
import { BaseModel } from './base-model';
import { Checkin } from './checkin';

export class User extends BaseModel {
  static table = 'users';

  static associations: Associations = {
    checkin_users: {
      type: 'has_many',
      foreignKey: 'user_id'
    }
  };

  @field('full_name') fullName: string;
  @field('username') username: string;
  @field('keycloak_id') keycloakId: string;
  @field('photo') photo: string;
  @field('bio') bio: string;
  @field('admin') admin: boolean;

  @lazy
  checkins = this.collections
    .get<Checkin>('checkins')
    .query(Q.on('user_checkins', 'user_id', this.id));
}
