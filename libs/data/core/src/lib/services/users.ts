import { inject, autoInjectable } from 'tsyringe';
import { ActContext } from '../context';
import { User } from '../schema/user';
import { Q } from '@nozbe/watermelondb';
import jwt_decode from 'jwt-decode';
import { BaseService } from './base-service';

type Token = {
  sub: string;
  username: string;
  admin: boolean;
};

@autoInjectable()
export class UsersService extends BaseService<User> {
  constructor(@inject('ActContext') private _context?: ActContext) {
    super(_context, 'users');
  }

  async insertIfDoesNotExist(token: string): Promise<{
    username: string;
    admin: boolean;
    id: string;
  }> {
    const { sub, username, admin } = jwt_decode<Token>(token);

    const userByKeycloakId = await this._collection
      .query(Q.where('keycloak_id', sub))
      .fetch();

    if (userByKeycloakId.length > 0) {
      return {
        username,
        id: userByKeycloakId[0].id,
        admin
      };
    }

    const newUserId = await this.insertWithProps({
      fullName: 'New user',
      username: username,
      keycloakId: sub
    });

    return {
      username,
      id: newUserId.id,
      admin
    };
  }
}
