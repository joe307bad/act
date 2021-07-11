import { inject, autoInjectable } from 'tsyringe';
import { ActContext } from '../context';
import { User } from '../schema/user';
import { Q } from '@nozbe/watermelondb';
import jwt_decode from 'jwt-decode';
import { BaseService } from './base-service';

type Token = {
  sub: string;
  username: string;
};

@autoInjectable()
export class UsersService extends BaseService<User> {
  constructor(@inject('ActContext') private _context?: ActContext) {
    super(_context, 'users');
  }

  async insertIfDoesNotExist(token: string) {
    const decodedToken = jwt_decode<Token>(token);

    const userByKeycloakId = await this._collection
      .query(Q.where('keycloak_id', decodedToken.sub))
      .fetch();

    if (userByKeycloakId.length > 0) {
      return userByKeycloakId[0].id;
    }

    const newUserId = await this.insertWithProps({
      fullName: 'New user',
      username: decodedToken.username,
      keycloakId: decodedToken.sub
    });

    return newUserId.id;
  }
}
