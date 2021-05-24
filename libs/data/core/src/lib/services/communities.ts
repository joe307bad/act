import { inject, autoInjectable } from 'tsyringe';
import { ActContext } from '../context';

@autoInjectable()
export class CommunitiesService {
  constructor(@inject('ActContext') private _context?: ActContext) {}

  insert() {
    const d = this._context;
  }
}
