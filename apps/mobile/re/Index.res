open ReactNative

type post = {
  id: int,
  title: string,
}

@react.component
let make = (~allPosts: array<post>, ~insertPost: ReactNative.Event.pressEvent => unit) => {
  <View>
    <Button title="Add Post" onPress={insertPost} />
    <FlatList
      renderItem={post => <Text> {post.item.title |> React.string} </Text>}
      keyExtractor={(post, _) => post.id |> Belt.Int.toString}
      data={allPosts}
    />
  </View>
}
