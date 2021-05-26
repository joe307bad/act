import {
  date,
  field,
  readonly
} from '@nozbe/watermelondb/decorators';
import { BaseModel } from './base-model';

export class Checkin extends BaseModel {
  static table = 'checkins';
  @field('name') name: string;
}
