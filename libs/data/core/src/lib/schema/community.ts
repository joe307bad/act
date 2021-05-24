import {
  date,
  field,
  readonly
} from '@nozbe/watermelondb/decorators';
import { Model } from '@nozbe/watermelondb';

export class Community extends Model {
  static table = 'communities';
  @field('name') name: string;
  @field('deleted') deleted: boolean;
  @readonly @date('created_at') createdAt;
  @readonly @date('updated_at') updatedAt;
}
