import { appSchema, tableSchema } from '@nozbe/watermelondb'
import SQLiteAdapter from '@nozbe/watermelondb/adapters/sqlite'
import { Database } from '@nozbe/watermelondb'
import { field } from '@nozbe/watermelondb/decorators'

import { Model } from '@nozbe/watermelondb'
import { schemaMigrations } from '@nozbe/watermelondb/Schema/migrations'

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
                { name: 'created', type: 'number' },
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
    schema,
    migrations: schemaMigrations({ migrations: [] })
})

export default class Post extends Model {
    static table = 'posts'
    @field('title') title: string;
    @field('created') created: number;
}

const database = new Database({
    adapter,
    modelClasses: [Post],
    actionsEnabled: true,
})

const postsCollection = database.collections.get<Post>('posts')

export { database, postsCollection };