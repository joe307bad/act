import { container, instanceCachingFactory } from 'tsyringe';
import { CommunitiesService } from './services/communities';
import { ContextService } from './services/context';
import { ActContext } from './context';
import { SyncService } from './services/sync';
import { useCollectionFactory } from './react/use-collection';
import { EventsService } from './services/events';
import { AchievementCategoriesService } from './services/achievement-categories';

export const registryFactory = (adapter) => {
  container.register('ContextService', ContextService);
  container.register('SyncService', SyncService);
  container.register('CommunitiesService', CommunitiesService);
  container.register(
    'AchievementCategoriesService',
    AchievementCategoriesService
  );
  container.register('EventsService', EventsService);

  container.register('ActContext', {
    useFactory: instanceCachingFactory<ActContext>(() => {
      return new ActContext(adapter);
    })
  });

  const database = new ContextService().get();

  return {
    sync: new SyncService().sync,
    get: database,
    useCollection: useCollectionFactory(database),
    models: {
      communities: new CommunitiesService(),
      events: new EventsService(),
      achievementCategories: new AchievementCategoriesService()
    }
  };
};
