import { field } from '@nozbe/watermelondb/decorators';
import { BaseModel } from './base-model';

export class Upload extends BaseModel {
  static table = 'uploads';
  @field('name') name: string;
}
