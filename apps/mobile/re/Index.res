open ReactNative
open Stacks
open Paper

module AwesomeButton = {
  @module("../src/app/AwesomeButton") @react.component
  external make: (~children: React.element, ~onPress: unit => 'a) => React.element = "default"
}

module ActData = {
  @module("@act/data/rn")
  external authorize: unit => Js.Promise.t<unit> = "authorize"
}

type post = {
  id: int,
  name: string,
}

module App = {
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
      ~surface="white",
      ~text="black",
    )

    let theme = ThemeProvider.Theme.make(~fonts, ~animation, ~dark, ~roundness, ~colors, ())
    let {colors} = ThemeProvider.useTheme()
    let debugStyle = useDebugStyle()
    <ThemeProvider theme>
      <FillView
        padding=[2.]
        style={Style.style(~backgroundColor=colors.background, ())}
        alignX=[#center]
        alignY=[#center]>
        <Rows space=[1.] alignY=[#center]>
          <Card elevation=5>
            <Box padding=[2.]>
              <Row height=[#content] paddingBottom=[2.]>
                <View style={Style.arrayOption([debugStyle])}>
                  <Headline> {"Welcome to the Act App"->React.string} </Headline>
                  <Paper.Text style={Style.style(~fontFamily="sans-serif", ())}>
                    {"Authorize using Keycloak"->React.string}
                  </Paper.Text>
                </View>
              </Row>
              <Row height=[#content]>
                <View style={Style.arrayOption([debugStyle])}>
                  <AwesomeButton onPress={() => ActData.authorize()->Js.Promise.then_(result => {
                        Js.log(result)
                        Js.Promise.resolve()
                      }, _)}> {"Authorize"->React.string} </AwesomeButton>
                </View>
              </Row>
            </Box>
          </Card>
        </Rows>
      </FillView>
    </ThemeProvider>
  }
}

@react.component
let make = (~allPosts: array<post>, ~sync: ReactNative.Event.pressEvent => unit) => {
  <StacksProvider debug={false} spacing=5.> <App /> </StacksProvider>
}
