open ReactNative
open Stacks

type post = {
  id: int,
  name: string,
}

@react.component
let make = (~allPosts: array<post>, ~sync: ReactNative.Event.pressEvent => unit) => {
  <StacksProvider spacing=4.>
    <Rows alignY=[#center]>
      <Row height=[#content]> <Paper.TextInput label="gkguygkuy" mode=#outlined /> </Row>
      <Row height=[#content]> <Paper.TextInput label="gkguygkuy" mode=#outlined /> </Row>
    </Rows>
  </StacksProvider>
}
