import {
  date,
  field,
  readonly
} from '@nozbe/watermelondb/decorators';
import { BaseModel } from './base-model';

export class Community extends BaseModel {
  static table = 'communities';
  @field('name') name: string;
}
