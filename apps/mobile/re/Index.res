open ReactNative
open Stacks

type post = {
  id: int,
  name: string,
}

let styles = {
  open Style
  StyleSheet.create({
    "red": viewStyle(~backgroundColor="red", ~height=100.->pct, ()),
    "green": viewStyle(~backgroundColor="green", ~height=100.->pct, ()),
  })
}

@react.component
let make = (~allPosts: array<post>, ~sync: ReactNative.Event.pressEvent => unit) => {
  <StacksProvider spacing=5.>
    <Rows space=[1.] alignY=[#center]>
      <Row height=[#x14]>
        <View style={styles["red"]}> <Text> {"hey there"->React.string} </Text> </View>
      </Row>
      <Row> <View style={styles["green"]}> <Text> {"hey there"->React.string} </Text> </View> </Row>
    </Rows>
  </StacksProvider>
}
