open ReactNative
open Stacks
open Paper
open ReactNavigation

module AwesomeButton = {
  @module("../src/app/AwesomeButton") @react.component
  external make: (
    ~children: React.element,
    ~onPress: unit => 'a,
    ~disabled: bool=?,
  ) => React.element = "default"
}
module SyncStatus = {
  @module("../src/app/shared/icons/SyncStatus") @react.component
  external make: unit => React.element = "default"
}

module Entry = {
  @module("../src/app/Entry") @react.component
  external make: unit => React.element = "default"
}

module ActDrawer = {
  @module("../src/app/core/nav/Drawer.tsx") @react.component
  external make: (~children: React.element) => React.element = "default"
}

module ActData = {
  type authStatus =
    | Pending
    | Authenticated
    | Unauthenticated
  type useActAuthHook = {status: authStatus, initialSyncComplete: bool, syncFailed: bool}
  @module("@act/data/rn")
  external useActAuth: unit => useActAuthHook = "useActAuth"

  type db = {sync: unit => unit}
  @module("@act/data/rn")
  external db: db = "default"
}

module Keycloak = {
  type keycloak = {login: (. unit) => Js.Promise.t<unit>, logout: (. unit) => Js.Promise.t<unit>}
  type keycloakHook = {keycloak: keycloak}
  @module("@react-keycloak/native")
  external useKeycloak: unit => keycloakHook = "useKeycloak"
}

module ScreenContainer = {
  @react.component
  let make = (~children, ~center: bool=false) => {
    let {colors} = ThemeProvider.useTheme()
    <Box
      flex=[#fluid]
      padding=[2.]
      paddingTop=[0.]
      paddingBottom=[0.]
      alignY=[center ? #center : #top]
      style={Style.style(~backgroundColor=colors.background, ())}>
      <Stacks.Stack space=[2.]> {children} </Stacks.Stack>
    </Box>
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
    let {initialSyncComplete} = ActData.useActAuth()
    <Rows padding=[2.] space=[2.]>
      <Row height=[#x13]> {<> </>} </Row>
      <Row height=[#x13]>
        <Box flex=[#fluid] alignY=[#center]>
          <Card elevation=5>
            <Box padding=[2.]>
              <View>
                <Headline> {"Welcome to the Act App"->React.string} </Headline>
                <Paper.Text
                  style={Style.style(
                    ~fontFamily={Platform.os === Platform.ios ? "Arial" : "sans-serif"},
                    ~paddingBottom=5.->ReactNative.Style.dp,
                    (),
                  )}>
                  {"Authorize using Keycloak"->React.string}
                </Paper.Text>
              </View>
              <AwesomeButton
                disabled={!initialSyncComplete}
                onPress={() => keycloak.login(.)->Js.Promise.catch(result => {
                    Js.log(result)
                    Js.Promise.resolve()
                  }, _)}>
                {"Authorize"->React.string}
              </AwesomeButton>
            </Box>
          </Card>
        </Box>
      </Row>
      <Row height=[#x13]> <SyncStatus /> </Row>
    </Rows>
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
  include ReactNavigation.Drawer.Make({
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
        ~ios=ThemeProvider.Theme.Fonts.platformFont(
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
    let screens = Js.Dict.fromList(list{("Achievements", "Achievements/:id")})

    let theme = ThemeProvider.Theme.make(~fonts, ~animation, ~dark, ~roundness, ~colors, ())
    let {status} = ActData.useActAuth()
    <StacksProvider debug={false}>
      <FillView style={Style.style(~backgroundColor="#eae8ff", ())}>
        <Paper.PaperProvider theme>
          <Native.NavigationContainer
            linking={
              prefixes: [`io.act.auth://${Platform.os === Platform.ios ? "" : "io.act.host/"}`],
              config: {screens: screens},
            }>
            <ActDrawer>
              {
                // This approach of rendering the screens based on auth status throws a
                // react navigation/keycloak redirect warning sayting "this redirect URI/component doesnst exist"
                // because the component itself is not rendered due to this instance of pattern matching
                switch status {
                | Authenticated => <Screen name="Entry" component=EntryComponent.make />
                | Unauthenticated =>
                  <Screen
                    name="Login"
                    options={_ => options(~gestureEnabled=false, ())}
                    component=Login.make
                  />
                | _ => <Screen name="Pending" component=Pending.make />
                }
              }
            </ActDrawer>
          </Native.NavigationContainer>
        </Paper.PaperProvider>
      </FillView>
    </StacksProvider>
  }
}
