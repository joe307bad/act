open ReactNative
open Stacks
open Paper
open ReactNavigation

module AwesomeButton = {
  @module("../src/app/AwesomeButton") @react.component
  external make: (~children: React.element, ~onPress: unit => 'a) => React.element = "default"
}

module Entry = {
  @module("../src/app/Entry") @react.component
  external make: unit => React.element = "default"
}

module ActData = {
  type authStatus =
    | Pending
    | Authenticated
    | Unauthenticated
  type useActAuthHook = {status: authStatus}
  @module("@act/data/rn")
  external useActAuth: unit => useActAuthHook = "useActAuth"
}

module Keycloak = {
  type keycloak = {login: (. unit) => Js.Promise.t<unit>, logout: (. unit) => Js.Promise.t<unit>}
  type keycloakHook = {keycloak: keycloak}
  @module("@react-keycloak/native")
  external useKeycloak: unit => keycloakHook = "useKeycloak"
}

module ScreenContainer = {
  @react.component
  let make = (~children) => {
    let {colors} = ThemeProvider.useTheme()
    <FillView style={Style.style(~backgroundColor=colors.background, ())} padding=[2.]>
      {children}
    </FillView>
  }
}

module Login = {
  include ReactNavigation.Stack.Make({
    type params = unit
  })
  @react.component
  let make = (~navigation, ~route as _) => {
    let debugStyle = useDebugStyle()
    let {keycloak} = Keycloak.useKeycloak()
    <ScreenContainer>
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
                <AwesomeButton onPress={() => keycloak.login(.)->Js.Promise.catch(result => {
                      Js.log(result)
                      Js.Promise.resolve()
                    }, _)}> {"Authorize"->React.string} </AwesomeButton>
              </View>
            </Row>
          </Box>
        </Card>
      </Rows>
    </ScreenContainer>
  }
}

module EntryComponent = {
  @react.component
  let make = (~navigation, ~route as _) => <Entry.make />
}

module Pending = {
  @react.component
  let make = (~navigation, ~route as _) => {
    <ScreenContainer> <Headline> {""->React.string} </Headline> </ScreenContainer>
  }
}

module Root = {
  include ReactNavigation.Stack.Make({
    type params = unit
  })
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
      ~backdrop="rgba(0, 0, 0, 0.33)",
      ~disabled="#adacb5",
      ~error="#c83e4d",
      ~placeholder="#470FF4",
      ~surface="white",
      ~text="black",
    )
    let screens = Js.Dict.fromList(list{("CreateCheckin", "CreateCheckin/:id")})
    let theme = ThemeProvider.Theme.make(~fonts, ~animation, ~dark, ~roundness, ~colors, ())
    let {status} = ActData.useActAuth()
    <FillView style={Style.style(~backgroundColor="#eae8ff", ())}>
      <Paper.PaperProvider theme>
        <Native.NavigationContainer
          linking={prefixes: ["io.act.auth://io.act.host/"], config: {screens: screens}}>
          <Navigator headerMode=#none>
            {
              // This approach of rendering the screens based on auth status throws a
              // react navigation/keycloak redirect warning sayting "this redirect URI/component doesnst exist"
              // because the component itself is not rendered due to this instance of pattern matching
              switch status {
              | Authenticated => <Screen name="Entry" component=EntryComponent.make />
              | Unauthenticated => <Screen name="Login" component=Login.make />
              | _ => <Screen name="Pending" component=Pending.make />
              }
            }
          </Navigator>
        </Native.NavigationContainer>
      </Paper.PaperProvider>
    </FillView>
  }
}
