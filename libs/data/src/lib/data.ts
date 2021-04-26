import { database, postsCollection } from './database';
import { sync } from './sync';

const insertPost = () => database.action(() => postsCollection.create(post => {
        post.title = 'New post'
        post.created = 1619405192
    })).then(() => {
        sync();
    })

export { insertPost };