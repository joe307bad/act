import 'reflect-metadata';
import { container, instanceCachingFactory } from 'tsyringe';
import { CommunitiesService } from './services/communities';
import { ContextService } from './services/context';
import { ActContext } from './context';
import { SyncService } from './services/sync';
import { useCollectionFactory } from './react/use-collection';
import { EventsService } from './services/events';
import { AchievementCategoriesService } from './services/achievement-categories';
import { AchievementsService } from './services/achievements';
import { UsersService } from './services/users';
import { CheckinsService } from './services/checkins';
import { SeedArgs, SeedService } from './services/seed';
import {
  AchievementSeed,
  Categories
} from './services/seed/AchievementSeed';
import { MockFactory } from 'mockingbird-ts';
import { isString } from 'lodash';
import { CheckinUsersService } from './services/checkin-users';
import { CreateCheckinSeed } from './services/seed/CreateCheckinSeed';
import { UploadsService } from './services/uploads';

const seedWithMock = (seed: (args: SeedArgs) => void) => ({
  achievements: (numberOfAchievements: number) =>
    seed({
      type: 'ACHIEVEMENTS',
      units: {
        achievements: [...new Array(numberOfAchievements)].map(() =>
          MockFactory.create<AchievementSeed>(AchievementSeed)
        ),
        categories: Object.values(Categories).filter((c) =>
          isString(c)
        )
      }
    }),
  checkins: (numberOfCheckins: number) => {
    return seed({
      type: 'CHECKINS',
      units: {
        checkins: [...new Array(numberOfCheckins)].map(() =>
          MockFactory.create<CreateCheckinSeed>(CreateCheckinSeed)
        )
      }
    });
  }
});

export const registryFactory = (
  adapter,
  config?: { ACT_API_URL?: string; KEYCLOAK_URL?: string }
) => {
  container.register('ContextService', ContextService);
  container.register('SyncService', SyncService);
  container.register('CommunitiesService', CommunitiesService);
  container.register(
    'AchievementCategoriesService',
    AchievementCategoriesService
  );
  container.register('EventsService', EventsService);
  container.register('CheckinsService', CheckinsService);
  container.register('SeedService', SeedService);

  container.register('ActContext', {
    useFactory: instanceCachingFactory<ActContext>(() => {
      return new ActContext(adapter, config || {});
    })
  });

  debugger;  
  const b = new ContextService()

  debugger;
  const database = b.get();
  const { seed, seedWithAchievementsJsonFile } = new SeedService();

  return {
    sync: new SyncService().sync,
    seedWithMock: seedWithMock(seed),
    seedWithAchievementsJsonFile,
    get: database,
    useCollection: useCollectionFactory(database),
    models: {
      communities: new CommunitiesService(),
      events: new EventsService(),
      achievementCategories: new AchievementCategoriesService(),
      achievements: new AchievementsService(),
      users: new UsersService(),
      checkins: new CheckinsService(),
      checkinUsers: new CheckinUsersService(),
      uploads: new UploadsService()
    }
  };
};
