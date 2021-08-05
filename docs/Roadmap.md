<h1 align="center">Roadmap</h1>

## September 2021

#### User/Auth

- ✅ **[MOBILE]** - On app init, run a sync to get existing users. Otherwise a user ID/keycloak ID could get out of sync with the local DB.
- ✅ **[API] + [KEYCLOAK]** - Send down an admin/non-admin key in the access token
- ✅ **[MOBILE] + [KEYCLOAK]** - Sending down a display name from Keycloak (from first name)

#### Sync

- ✅ **[MOBILE]** - There probably should be an auto sync somewhere triggered by something - Sync on create checkin, on keycloak provider mount, and sync button in toolbar

#### Checkin Builder

- ✅ **[MOBILE]** - For non-admins, default to a single user (the current user)
- ✅ **[MOBILE]** - Live total points count on the Achievement Selector
- ✅ **[MOBILE]** - Text search for Achievement Selector
- ✅ **[MOBILE]** - Info icons to see Achievement description
- ✅ **[MOBILE]** - Field for note
- [ ] **[MOBILE]** - Field for approved (non-admins default to false), and submit for creation
    - Can we do some sort of checkin receipt upon creation?
    - Maybe a little modal that dismisses itself after a couple seconds?

#### Checkin/Feed

- [ ] **[MOBILE] + [WEB]** - View a users checkins (most likely from the leaderboard on mobile)
- [ ] **[MOBILE]** - Ability to see a feed of checkins sorted by most recent to oldest
- [ ] **[MOBILE]** - Admins should be able to delete checkins from the feed
- [ ] **[MOBILE]** - List of checkins with pending approvals + way to approve all pending checkins

#### Achievements

- [ ] **[MOBILE]** - List of achievements in tabbed category view, ability to select 1 and checkin to it
- [ ] **[MOBILE]** - Ability to search list of achievements

#### Leaderboard

- [ ] **[MOBILE]** - List of user sorted by most points to least points
  - This will probably involve `useCollection('checkin_achievements')` because that will give us the updated data to recalculate the leaderboard points
  - We also want to add `totalPoints` to the `checkins` unit. Any time a checkin is updated/inserted, this property is calculcated
- [ ] **[MOBILE]** - Ability to select user and see their checkins

#### Deployment

- [ ] **[WEB]** - Make `db.seed` method to seed achievements and achievement categories

#### Profile

- [ ] **[MOBILE]** - In the side menu, show username, total points, total checkins

#### Distribution

- [ ] **[MOBILE]** - Bitrise pipeline that provides public links for Android/iOS downloads
- [ ] **[OPS]** - Reslient and automated API + Keycloak + DB deployment

## Beyond

- [ ] **[MOBILE] [WEB] [OPS]** - Live feed of checkins with web sockets
- [ ] **[MOBILE] [WEB] [OPS]** - Photo uploads as seperate entities and attached to checkins
- [ ] **[MOBILE]** - More advanced stats on checkins (checkins per hour, checkins per day, who has the most points in a specific time frame, etc.)
- More listed in the READMEs of Points
