open ReactNative

type post = {
  id: int,
  name: string,
}

@react.component
let make = (~allPosts: array<post>, ~sync: ReactNative.Event.pressEvent => unit) => {
  <View>
    <Button title="Sync" onPress={sync} />
    <FlatList
      renderItem={post => <Text> {post.item.name |> React.string} </Text>}
      keyExtractor={(post, _) => post.id |> Belt.Int.toString}
      data={allPosts}
    />
    <Paper.TextInput label="Username" mode=#outlined />
    <Paper.TextInput label="Password" mode=#outlined secureTextEntry=true />
    <Paper.Button onPress={_ => Js.log("pressed")} mode=#contained>
      {"Login" |> React.string}
    </Paper.Button>
  </View>
}
