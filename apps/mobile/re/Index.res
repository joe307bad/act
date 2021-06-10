open ReactNative
open Stacks
open Paper
open ReactNavigation

module AwesomeButton = {
  @module("../src/app/AwesomeButton") @react.component
  external make: (~children: React.element, ~onPress: unit => 'a) => React.element = "default"
}

module ActData = {
  @module("@act/data/rn")
  external authorize: unit => Js.Promise.t<unit> = "authorize"
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
                    }, _)}> {"Authorize"->React.string} </AwesomeButton> <AwesomeButton
                  onPress={() => keycloak.logout(.)->Js.Promise.catch(result => {
                      Js.log(result)
                      Js.Promise.resolve()
                    }, _)}>
                  {"Logout"->React.string}
                </AwesomeButton> <AwesomeButton
                  onPress={() => navigation->Navigation.navigate("CreateCheckin")}>
                  {"Go to Create Checkin Screen"->React.string}
                </AwesomeButton>
              </View>
            </Row>
          </Box>
        </Card>
      </Rows>
    </ScreenContainer>
  }
}

// @react.component
// let make = (~allPosts: array<post>, ~sync: ReactNative.Event.pressEvent => unit) => {
//   <StacksProvider debug={false} spacing=5.> <Login /> </Sta cksProvider>
// }

module CreateCheckin = {
  @react.component
  let make = (~navigation, ~route as _) => {
    <ScreenContainer>
      <Headline> {"Create Checkin page"->React.string} </Headline>
    </ScreenContainer>
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
      ~backdrop="#eae8ff",
      ~disabled="#adacb5",
      ~error="#c83e4d",
      ~placeholder="#470FF4",
      ~surface="white",
      ~text="black",
    )
    let screens = Js.Dict.fromList(list{("CreateCheckin", "CreateCheckin/:id")})
    let theme = ThemeProvider.Theme.make(~fonts, ~animation, ~dark, ~roundness, ~colors, ())
    <FillView style={Style.style(~backgroundColor="#eae8ff", ())}>
      <ThemeProvider theme>
        <Native.NavigationContainer
          linking={prefixes: ["io.act.auth://io.act.host/"], config: {screens: screens}}>
          <Navigator headerMode=#none>
            <Screen name="Login" component=Login.make />
            <Screen name="CreateCheckin" component=CreateCheckin.make />
          </Navigator>
        </Native.NavigationContainer>
      </ThemeProvider>
    </FillView>
  }
}
