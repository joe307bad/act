open ReactNative
open Stacks
open Paper

module AwesomeButton = {
  @module("../src/app/AwesomeButton") @react.component
  external make: (
    ~children: React.element,
    ~onPress: unit => 'a,
    ~disabled: bool=?,
  ) => React.element = "default"
}
module Onboarding = {
  @module("../src/app/shared/components/Onboarding") @react.component
  external make: unit => React.element = "default"
}
module Logo = {
  @module("../src/app/shared/components/Logo") @react.component
  external make: unit => React.element = "default"
}

module Entry = {
  @module("../src/app/Entry") @react.component
  external make: unit => React.element = "default"
}

module ActDrawer = {
  @module("../src/app/core/nav/Drawer.tsx") @react.component
  external make: unit => React.element = "default"
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
      <Row height=[#x13]> <Onboarding /> </Row>
      <Row height=[#x13]> {<> </>} </Row>
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
    <FillView style={Style.style(~backgroundColor="#eae8ff", ())}> <ActDrawer /> </FillView>
  }
}
