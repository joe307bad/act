import {
  date,
  field,
  readonly
} from '@nozbe/watermelondb/decorators';
import { Model } from '@nozbe/watermelondb';

export class BaseModel extends Model {
  @field('deleted') deleted: boolean;
  @readonly @date('created_at') createdAt;
  @readonly @date('updated_at') updatedAt;
}
