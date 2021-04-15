import { postsCollection } from '@act/data';
import withObservables from '@nozbe/with-observables';
import { make } from "../../lib/es6/re/Index.bs";
 
 const appWithPosts = withObservables(['post'], () => ({
     allPosts: postsCollection.query().observe()
 }))
 const AppWithPosts = appWithPosts(make)
 
 export default AppWithPosts
 