import { interval } from 'rxjs';
import { take } from 'rxjs/operators';
import { appSchema, tableSchema } from '@nozbe/watermelondb'
import SQLiteAdapter from '@nozbe/watermelondb/adapters/sqlite'
import { Database } from '@nozbe/watermelondb'
import { field } from '@nozbe/watermelondb/decorators'

import { Model } from '@nozbe/watermelondb'

const schema = appSchema({
    version: 1,
    tables: [
        tableSchema({
            name: 'posts',
            columns: [
                { name: 'title', type: 'string' },
                { name: 'subtitle', type: 'string', isOptional: true },
                { name: 'body', type: 'string' },
                { name: 'is_pinned', type: 'boolean' },
            ]
        }),
        tableSchema({
            name: 'comments',
            columns: [
                { name: 'body', type: 'string' },
                { name: 'post_id', type: 'string', isIndexed: true },
            ]
        }),
    ]
})

const adapter = new SQLiteAdapter({
    schema
})

export default class Post extends Model {
    static table = 'posts'
    @field('title') title: string;
}

const database = new Database({
    adapter,
    modelClasses: [Post],
    actionsEnabled: true,
})

const postsCollection = database.collections.get<Post>('posts')

const insertPost = () => database.action(async () => {
    return [await postsCollection.create(post => {
        post.title = 'New post'
    }), await postsCollection.query().fetch()]
})


const o = interval(2000).pipe(
    take(4)
)

const foo = () => insertPost().then(result => console.log(result));

export { foo, postsCollection };