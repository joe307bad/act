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
  full_name: string;
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
    fullName: string;
  }> {
    const { sub, username, admin, full_name } =
      jwt_decode<Token>(token);

    const userByKeycloakId = await this.getByKeycloakId(sub);

    if (userByKeycloakId.length > 0) {
      return {
        username,
        id: userByKeycloakId[0].id,
        admin,
        fullName: full_name
      };
    }

    const newUserId = await this.insertWithProps({
      fullName: full_name,
      username: username,
      keycloakId: sub,
      admin: admin
    });

    return {
      username,
      id: newUserId.id,
      admin,
      fullName: full_name
    };
  }

  getByKeycloakId = (keycloakId: string): Promise<User[]> =>
    this._collection
      .query(Q.where('keycloak_id', keycloakId))
      .fetch();
}
