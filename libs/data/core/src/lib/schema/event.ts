import {
  date,
  field,
  readonly
} from '@nozbe/watermelondb/decorators';
import { Model } from '@nozbe/watermelondb';

export class Event extends Model {
  static table = 'events';
  @field('name') name: string;
  @date('start_date') startDate;
  @date('end_date') endDate;
  @field('deleted') deleted: boolean;
  @readonly @date('created_at') createdAt;
  @readonly @date('updated_at') updatedAt;
}
