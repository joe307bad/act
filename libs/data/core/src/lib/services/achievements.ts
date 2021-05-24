import { inject, autoInjectable } from 'tsyringe';
import { ActContext } from '../context';
import { Achievement } from '../schema';
import { BaseService } from './base-service';

@autoInjectable()
export class AchievementsService extends BaseService<Achievement> {
  constructor(@inject('ActContext') private _context?: ActContext) {
    super(_context, 'achievements');
  }
}
