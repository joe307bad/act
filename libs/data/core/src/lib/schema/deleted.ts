import {
  date,
  field,
  readonly
} from '@nozbe/watermelondb/decorators';
import { BaseModel } from './base-model';

export class Deleted extends BaseModel {
  static table = 'deleted';
  @field('deleted_id') deletedId: string;
}
