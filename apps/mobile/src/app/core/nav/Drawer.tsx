import { NavigationContainer } from '@react-navigation/native';
import React, { FC } from 'react';
import { View } from 'react-native';
import { List, useTheme } from 'react-native-paper';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {
  createDrawerNavigator,
  DrawerContentComponentProps,
  DrawerContentOptions
} from '@react-navigation/drawer';

MaterialCommunityIcons.loadFont();

const DrawerList: FC<
  DrawerContentComponentProps<DrawerContentOptions>
> = ({ navigation }) => {
  return (
    <>
      <List.Item
        onPress={() => {
          navigation.navigate('Entry', { screen: 'CreateCheckin' });
        }}
        style={{
          borderBottomWidth: 1,
          borderBottomColor: 'blue'
        }}
        titleStyle={{ fontSize: 25 }}
        title={'Create Checkin'}
        description={'Create a checkin for one or more achievements'}
        left={(props) => (
          <View
            style={{
              justifyContent: 'center'
            }}
          >
            <MaterialCommunityIcons
              name="checkbox-marked-circle-outline"
              color={'blue'}
              size={40}
            />
          </View>
        )}
      />
      <List.Item
        onPress={() => {
          navigation.navigate('Entry', { screen: 'Achievements' });
        }}
        style={{
          borderBottomWidth: 1,
          borderBottomColor: 'blue'
        }}
        titleStyle={{ fontSize: 25 }}
        title={'Achievements'}
        description={'View Achievements and Categories'}
        left={(props) => (
          <View
            style={{
              justifyContent: 'center'
            }}
          >
            <MaterialCommunityIcons
              name="star-circle-outline"
              color={'blue'}
              size={40}
            />
          </View>
        )}
      />
    </>
  );
};

const D = createDrawerNavigator();

const Drawer = ({ children }) => (
  <D.Navigator
    openByDefault
    overlayColor="transparent"
    drawerContent={DrawerList}
  >
    {children}
  </D.Navigator>
);

export default Drawer;
