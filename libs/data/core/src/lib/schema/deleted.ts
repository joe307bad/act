import {
  date,
  field,
  readonly
} from '@nozbe/watermelondb/decorators';
import { Model } from '@nozbe/watermelondb';

export class Deleted extends Model {
  static table = 'deleted';
  @field('deleted_id') deletedId: string;
  @readonly @date('created_at') createdAt;
}
