import { CheckinUser } from '@act/data/core';
import db from '@act/data/rn';
import { CheckinAchievement } from '@act/data/core';
import { map } from 'rxjs/operators';

export const checkinUsersAndAchievements = () => ({
  userCheckins: db.get
    .get<CheckinUser>('checkin_users')
    .query()
    .observeWithColumns(['approved'])
    .pipe(
      map((ucs) =>
        ucs
          .sort((a, b) => b.createdAt - a.createdAt)
          .reduce((acc, item) => {
            const exists = acc.get(item.userId);
            if (exists) {
              return acc.set(
                item.userId,
                new Set([...exists, item.checkinId])
              );
            } else {
              return acc.set(item.userId, new Set([item.checkinId]));
            }
          }, new Map<string, Set<string>>())
      )
    ),
  checkinAchievements: db.get
    .get<CheckinAchievement>('checkin_achievements')
    .query()
    .observeWithColumns(['count'])
    .pipe(
      map((cas) =>
        cas.reduce((acc, item) => {
          const exists = acc.get(item.checkinId);
          if (exists) {
            return acc.set(
              item.checkinId,
              new Map([
                ...exists,
                ...new Map([[item.achievementId, item.count]])
              ])
            );
          } else {
            return acc.set(
              item.checkinId,
              new Map([[item.achievementId, item.count]])
            );
          }
        }, new Map<string, Map<string, number>>())
      )
    )
});
