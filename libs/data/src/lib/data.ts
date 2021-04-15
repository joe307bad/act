import { database, postsCollection } from './database';
import { sync } from './sync';

const insertPost = () => database.action(() => postsCollection.create(post => {
        post.title = 'New post'
    })).then(() => {
        debugger;
        sync();
    })

export { insertPost };