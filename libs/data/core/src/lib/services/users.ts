import { inject, autoInjectable } from 'tsyringe';
import { ActContext } from '../context';
import { User } from '../schema/user';
import { Q } from '@nozbe/watermelondb';
import jwt_decode from 'jwt-decode';
import { BaseService } from './base-service';

type Token = {
  sub?: string;
  username?: string;
  admin?: boolean;
  full_name?: string;
};

@autoInjectable()
export class UsersService extends BaseService<User> {
  constructor(@inject('ActContext') private _context?: ActContext) {
    super(_context, 'users');
  }

  async insertIfDoesNotExist(token: string): Promise<
    | {
        username: string;
        admin: boolean;
        id: string;
        fullName: string;
      }
    | false
  > {
    let parsedToken: Token;
    try {
      const jwt = jwt_decode<Token>(token);

      const { sub, username, admin, full_name } = jwt;
      if (!sub || !username || !admin || !full_name) {
        throw Error(
          `Something is wrong with your id token: ${JSON.stringify({
            sub,
            username,
            admin,
            full_name
          })}`
        );
      }

      parsedToken = jwt;
    } catch (e) {
      return false;
    }
    const { sub, username, admin, full_name } = parsedToken;

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
