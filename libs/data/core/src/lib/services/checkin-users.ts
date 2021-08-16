import { inject, autoInjectable } from 'tsyringe';
import { ActContext } from '../context';
import { CheckinUser } from '../schema';
import { BaseService } from './base-service';

@autoInjectable()
export class CheckinUsersService extends BaseService<CheckinUser> {
  constructor(@inject('ActContext') private _context?: ActContext) {
    super(_context, 'checkin_users');
  }
}
