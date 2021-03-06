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
- ✅ **[WEB]** - Make `db.seed` method to seed achievements and achievement categories

#### Distribution

- ✅ **[MOBILE]** - Bugsnag
- ✅ **[MOBILE]** - Get working on iOS lol
- ✅ **[MOBILE]** - Bitrise pipeline for Android
- ✅ **[OPS]** - Publicly accessible services behind HTTPS

## Alpha issues(should not be able to run concurrent sync commands)

- [ ] **[MOBILE]** - editing checkin note on the Achievements page does not push up text input on iOS
- ✅ **[MOBILE]** - Show users asociated with checkins in UserCheckins. So when there are multi-user checkins, a user can see what other users were grouped into that checkin when they're viewing their checkins on UserCheckins.
- ✅ **[MOBILE]** - add Bugsnag.notify to failed sync requests
- ✅ **[MOBILE]** - View Achievement detail Achievements by User on Leaderboard Screen
- ✅ **[MOBILE]** - View Achievement detail from User Checkins screen
- ✅ **[MOBILE]** - Side menu shows last synced timestamp and loading icon when syncing 
- ✅ **[MOBILE]** - Allow for achievement photos to show in the SingleCheckin component of the Achievements screen
- ✅ **[MOBILE]** - Way of switching over to clean DB after launch
- ✅ **[MOBILE]** - iOS deployment
- ✅ **[MOBILE]** - Only for admins (I think), does the CheckinBuilder not reset the selected users to the default users -> even though there is one user appearing as selced, internally the checkin has 0 users associated.
- ✅ **[MOBILE]** - Sort achievements by point value across the app
- ✅ **[MOBILE]** - Run `sync` on every created checkin.
- ✅ **[MOBILE]** - Remove TabbedList from Achievements in favor of category dropdown
- ✅ **[MOBILE]** - Remove TabbedList from CheckinBuilder in favor of category dropdown
- ✅ **[MOBILE]** - toLocaleString on
  - ✅ list of Achievements in UserCheckins
  - ✅ Points next to Achievements in Achievements list (and by extenstion the Checkin Builder)
- ✅ **[MOBILE]** - Show ID on checkin for UserCheckins -> may be useful for inspecting a Checkin from mobile on the web client

### Performance improvements
- ✅ **[MOBILE]** - Map `achievementsByCategory` and `categoriesById` up front in a `GlobalContext` to make accessing this info much better for Achievement lists (CheckinBuilder + Achievements screens)
- ✅ **[MOBILE]** - Can we improve performance by doing a lot of the Checkin mapping in `GlobalContext`?
- [ ] **[MOBILE]** - Use react-native-multithreading for leaderboard

### Tabbed List issues

- [ ] **[MOBILE]** - Would making the tabbed list eager (lazy=false)
- [ ] **[MOBILE]** - Do not make text selectable for items in Achievement list. Swiping to next category sometimes selected that achievement. 
- ✅ **[MOBILE]** - Limit Category titles on Achievement tab list to one line

## Beyond

- [ ] **[MOBILE]** - Implement versioning in Bitrise
- [ ] **[MOBILE]** - Use a checkin from User Checkins as a template
- [ ] **[MOBILE]** - Pinned achievements (single achievements and from the Checkin Builder)
- [ ] **[MOBILE]** - Bitrise pipeline for iOS
- [ ] **[MOBILE]** - Way of seeding Achievements newly added to JSON file (e.g. renaming categories, moving achievements to new categories, etc.)
- [ ] **[MOBILE]** - Toasts for successful sync/failed sync
- [ ] **[MOBILE]** - User achievements from Leaderboard should show Approved and Pending Approved as categories, not the Achievement categories
- [ ] **[MOBILE]** - (Profile) In the side menu, show username, total points, total checkins
- [ ] **[WEB]** - View a users checkin feed
- [ ] **[MOBILE] + [WEB] + [API]** - Access control layer/RBAC
- [ ] **[MOBILE] + [WEB] + [OPS]** - Live feed of checkins with web sockets
- [ ] **[MOBILE] + [WEB] + [OPS]** - Photo uploads for checkins
- [ ] **[MOBILE]** - More advanced stats on checkins (leaderboard by category, checkins per hour, checkins per day, who has the most points in a specific time frame, etc.)
- More listed in the READMEs of Points
- [ ] **[OPS]** - Reslient and automated API + Keycloak + DB deployment
- [ ] Ability to challenge people: "user 1 challenges user 2 to chug 2 beers". Either both users get points for completing something in a time frame, or it more of a head to head challenge type where users both have to initiate the timer.

## September 2021 Beta Observations:
- [ ] Sync was slow. This had to due partially because I didn't optimize properly and also because wifi seemed to be shifty. But there were instances were it seemed like the sync spinned continuously and I had to close out and reopen the app to get it to sync. There were also some weird edge cases where it felt that dropping wifi in the middle of a sync made things weird.
- [ ] Each phones leaderboard could get out of sync. I think this eventually resolved itself and was partially due to deleting checkins. Anyways, there prob should be a leaderboard endpoint that is online-only and acts a single source of truth.
- [ ] Required approvals for individual checkins should go away. Or maybe just scaled down to "only checkins that are > 500 pts need approvals"
- [ ] Some achievements should only be allowed once per weekend
- [ ] We need a third class of achievement organization, in addition to enabled/disabled. Potentially "archived". Furthermore, there was a suggestion for potentially looking at the most done achievements this year and scrubbing (archiving) the rest.

## Tech Debt

- [ ] **[MOBILE]** - TabbedList/Selector is convoluted because of optimization experimentation. TabbedList/Selector should be AchievementList specific and not overly generalized.
