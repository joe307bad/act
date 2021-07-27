<h1 align="center">Keycloak</h1>

### Adding username and admin client mappers

The `username` and `full_name` user properties should be included with the access token. Also, the boolean value `admin` should be added as a user attribute and sent with the access token as well. To add these, [this is a helpful resource](https://ravthiru.medium.com/keycloak-retrieve-custom-attributes-in-access-token-1a2d5aef0caa).

#### How to add a User Attribute Client Mapper

1. Clients > Mappers > Create >
2. the Mapper Type should be User Attribute (for `admin`) or User Property (`username` and `full_name`) >
3. Claim JSON type should be whatever type you want >
4. Select Add to access token
5. Select Save

The `username` and `firstName` mapper can be added without adding these attributes to each user since they are already built into the [Keycloak UserModel](https://www.keycloak.org/docs-api/4.8/javadocs/org/keycloak/models/UserModel.html). The `firstName` mapper should be passed through to the access token as `full_name`. This is achieved by using the Token Claim Name.

To add the `admin` user attribute to each user, these are the general steps:

1. Users > View all users >
2. Select Users who should be admins > Attributes >
3. Add `admin` as the key and `true` as the value.

### User Management

#### Adding a user

Adding a user in Keycloak is easy. After creating the user, also make sure these steps are included:

1. Set the users initial password under user Credentials and mark the password as temporary
1. Ensure in the user Details that Update Password is a Required User Actions

#### Resetting a users password

Resetting a users password is as easy as using the field under User > Credentials > Reset Password. Mark the password as Temporary and this should automatically mark Update Password as a Required USer Action under the user Details.
