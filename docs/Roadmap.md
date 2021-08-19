<h1 align="center">Roadmap</h1>

## September 2021

#### User/Auth

- ✅ **[MOBILE]** - On app init, run a sync to get existing users. Otherwise a user ID/keycloak ID could get out of sync with the local DB.
- ✅ **[API] + [KEYCLOAK]** - Send down an admin/non-admin key in the access token
- ✅ **[MOBILE] + [KEYCLOAK]** - Sending down a display name from Keycloak (from first name)

#### Checkin Builder

- ✅ **[MOBILE]** - For non-admins, default to a single user (the current user)
- ✅ **[MOBILE]** - Live total points count on the Achievement Selector
- ✅ **[MOBILE]** - Text search for Achievement Selector
- ✅ **[MOBILE]** - Info icons to see Achievement description
- ✅ **[MOBILE]** - Field for note
- ✅ **[MOBILE]** - Field for approved (non-admins default to false), submit for creation, and checkin success modal

#### Leaderboard

- ✅ **[MOBILE]** - List of user sorted by most points to least points
- ✅ **[MOBILE]** - Filter out checkins that have yet to be Approved
- ✅ **[MOBILE]** - Ability to select user and see their Achievements/Achievement Count

#### Checkin/Feed

- ✅ **[MOBILE]** - List of checkins with pending approvals + way to approve all pending checkins (while excluding some)
- ✅ **[MOBILE]** - Delete checkins from Pending Approvals screen
- ✅ **[MOBILE]** - "User Checkins" screen where you can see a list of checkins for a given user (select user from dropdown in header?). This would provide a nice way for an admin to quickly remove a single user from a checkin.

#### Achievements

- ✅ **[MOBILE]** - List of achievements in tabbed category view, ability to select 1 and checkin to it
- ✅ **[MOBILE]** - Ability to search list of achievements

#### Sync

- ✅ **[MOBILE]** - There probably should be an auto sync somewhere triggered by something - Sync on create checkin, on keycloak provider mount, and sync button in toolbar

#### Deployment

- ✅ **[MOBILE] + [WEB]** - Stress test - Web exposed method to generate a random checkin, then automate that method to run every minute to test syncing capabilities.
        - Also, generate 1000 checkins and see if that affects Mobile performance
- [ ] **[WEB]** - Make `db.seed` method to seed achievements and achievement categories

#### Distribution

- [ ] **[MOBILE]** - Bugsnag
- ✅ **[MOBILE]** - Get working on iOS lol
- [ ] **[MOBILE]** - Bitrise pipeline that provides public links for Android/iOS downloads
- ✅ **[OPS]** - Publicly accessible services behind HTTPS

## Beyond

- [ ] **[MOBILE]** - Toasts for successful sync/failed sync
- [ ] **[MOBILE]** - User achievements from Leaderboard should show Approved and Pending Approved as categories, not the Achievement categories
- [ ] **[MOBILE]** - Sort user achievements by number of times checked into the achievement
- [ ] **[MOBILE]** - (Profile) In the side menu, show username, total points, total checkins
- [ ] **[MOBILE] + [WEB]** - View a users checkin feed
- [ ] **[MOBILE]** - Ability to see a feed of checkins sorted by most recent to oldest
- [ ] **[MOBILE]** - Admins should be able to delete checkins from the feed
- [ ] **[MOBILE] + [WEB] + [API]** - Access control layer/RBAC
- [ ] **[MOBILE] + [WEB] + [OPS]** - Live feed of checkins with web sockets
- [ ] **[MOBILE] + [WEB] + [OPS]** - Photo uploads as seperate entities and attached to checkins
- [ ] **[MOBILE]** - More advanced stats on checkins (checkins per hour, checkins per day, who has the most points in a specific time frame, etc.)
- More listed in the READMEs of Points
- [ ] **[OPS]** - Reslient and automated API + Keycloak + DB deployment

## Tech Debt

- [ ] **[MOBILE]** - TabbedList/Selector is convoluted because of optimization experimentation. TabbedList/Selector should be AchievementList specific and not overly generalized.
