import { inject, autoInjectable } from '@triptyk/tsyringe';
import { ActContext } from '../context';

@autoInjectable()
export class ContextService {
  constructor(@inject('ActContext') private _context?: ActContext) {}

  get = () => this._context.get();
}
