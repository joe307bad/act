import {
  date,
  field,
  readonly
} from '@nozbe/watermelondb/decorators';
import { BaseModel } from './base-model';

export class User extends BaseModel {
  static table = 'users';
  @field('full_name') fullName: string;
  @field('username') username: string;
  @field('keycloak_id') keycloakId: string;
}
