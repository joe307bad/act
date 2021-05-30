open ReactNative
open Stacks

type post = {
  id: int,
  name: string,
}

let styles = {
  open Style
  StyleSheet.create({
    "red": Some(viewStyle(~height=100.->pct, ())),
  })
}

module App = {
  open Paper
  @react.component
  let make = () => {
    let debugStyle = useDebugStyle()
    Js.log(debugStyle)
    <Rows space=[1.] alignY=[#center] padding=[5.]>
      <Row height=[#content]>
        <View style={Style.arrayOption([debugStyle])}>
          <Headline> {"Login"->React.string} </Headline>
        </View>
      </Row>
      <Row height=[#content]>
        <View style={Style.arrayOption([debugStyle])}>
          <TextInput mode=#outlined label="Username" />
        </View>
      </Row>
      <Row height=[#content]>
        <View style={Style.arrayOption([debugStyle])}>
          <TextInput mode=#outlined label="Password" secureTextEntry=true />
        </View>
      </Row>
      <Row height=[#content]>
        <View style={Style.arrayOption([debugStyle])}>
          <Button onPress={_ => {Js.log()}} mode=#contained> {"Login"->React.string} </Button>
        </View>
      </Row>
    </Rows>
  }
}

@react.component
let make = (~allPosts: array<post>, ~sync: ReactNative.Event.pressEvent => unit) => {
  <StacksProvider debug={true} spacing=5.> <App /> </StacksProvider>
}
