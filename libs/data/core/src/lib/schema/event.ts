import {
  date,
  field,
  readonly
} from '@nozbe/watermelondb/decorators';
import { BaseModel } from './base-model';

export class Event extends BaseModel {
  static table = 'events';
  @field('name') name: string;
  @date('start_date') startDate;
  @date('end_date') endDate;
}
