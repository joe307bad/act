<h1 align="center">Roadmap</h1>

## September 2021

#### User/Auth

✅ **[MOBILE]** - On app init, run a sync to get existing users. Otherwise a user ID/keycloak ID could get out of sync with the local DB.

✅ **[API] + [KEYCLOAK]** - Send down an admin/non-admin key in the access token

- [ ] **[MOBILE] + [KEYCLOAK]** - Send down a display name from Keycloak (either from first name or another user attribute)

#### Sync

- [ ] **[MOBILE]** - There probably should be an auto sync somewhere triggered by something

#### Checkin Builder

- [ ] **[MOBILE]** - For non-admins, default to a single user (the current user)
- [ ] **[MOBILE]** - Live total points count on the Achievement Selector
- [ ] **[MOBILE]** - Text search for Achievement Selector
- [ ] **[MOBILE]** - Fields for note, approved (non-admins default to false), and submit for creation

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
- [ ] **[MOBILE]** - Ability to select user and see their checkins

#### Profile

- [ ] **[MOBILE]** - In the side menu, show username, total points, total checkins

#### Distribution

- [ ] **[MOBILE]** - Bitrise pipeline that provides public links for Android/iOS downloads
- [ ] **[OPS]** - Reslient and automated API + Keycloak + DB deployment

## Beyond

- [ ] **[MOBILE] [WEB] [OPS]** - Photo uploads as seperate entities and attached to checkins
- [ ] **[MOBILE]** - More advanced stats on checkins (checkins per hour, checkins per day, who has the most points in a specific time frame, etc.)
- More listed in the READMEs of Points
