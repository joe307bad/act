open ReactNative
open Stacks

module AwesomeButton = {
  @module("../src/app/AwesomeButton") @react.component
  external make: (~children: React.element) => React.element = "default"
}

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
    let fontFamily = "Bebas-Regular"
    let fonts = ThemeProvider.Theme.Fonts.configureFonts(
      ThemeProvider.Theme.Fonts.make(
        ~default=ThemeProvider.Theme.Fonts.platformFont(
          ~regular={fontFamily: fontFamily, fontWeight: "normal"},
          ~thin={fontFamily: fontFamily, fontWeight: "normal"},
          ~medium={fontFamily: fontFamily, fontWeight: "normal"},
          ~light={fontFamily: fontFamily, fontWeight: "normal"},
        ),
      ),
    )

    let animation = ThemeProvider.Theme.Animation.make(~scale=1.)
    let roundness = 0
    let dark = true
    let colors = ThemeProvider.Theme.Colors.make(
      ~primary="#470FF4",
      ~accent="#87FF65",
      ~background="#eae8ff",
      ~backdrop="#eae8ff",
      ~disabled="#adacb5",
      ~error="#c83e4d",
      ~placeholder="#470FF4",
      ~surface="#f2ede9",
      ~text="black",
    )

    let theme = ThemeProvider.Theme.make(~fonts, ~animation, ~dark, ~roundness, ~colors, ())
    let debugStyle = useDebugStyle()
    <ThemeProvider theme>
      <Rows space=[1.] alignY=[#center] padding=[3.]>
        <Row height=[#content]>
          <View style={Style.arrayOption([debugStyle])}>
            <Headline> {"Welcome to the Act App"->React.string} </Headline>
          </View>
        </Row>
        <Row height=[#content]>
          <View style={Style.arrayOption([debugStyle])}>
            <AwesomeButton> {"Authorize"->React.string} </AwesomeButton>
          </View>
        </Row>
      </Rows>
    </ThemeProvider>
  }
}

@react.component
let make = (~allPosts: array<post>, ~sync: ReactNative.Event.pressEvent => unit) => {
  <StacksProvider debug={false} spacing=5.> <App /> </StacksProvider>
}
