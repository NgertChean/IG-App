import React, { Component } from 'react';
import { Platform } from 'react-native';

import HomeTab from './AppTabNavigator/HomeTab';
import SearchTab from './AppTabNavigator/SearchTab';
import TabedManageCardScreen from './AppTabNavigator/TabedManageCardScreen';
import LikesTab from './AppTabNavigator/LikesTab';
import ProfileTab from './AppTabNavigator/ProfileTab';
import StackedManageCardScreen from './StackedManageCardScreen';

import { TabNavigator, StackNavigator } from 'react-navigation';
import { Icon } from 'native-base';

class MainScreen extends Component {
  static navigationOptions = {
    header: null
  };

  render() {
    return <AppTabNavigator />;
  }
}
export default MainScreen;

const AppTabNavigator = TabNavigator(
  {
    HomeTab: {
      screen: StackNavigator({
        HomeScreen: { screen: HomeTab },
        ManageCardScreen: { screen: StackedManageCardScreen }
      }),
      navigationOptions: {
        tabBarIcon: ({ tintColor }) => <Icon name="ios-home" style={{ color: tintColor }} />
      }
    },
    SearchTab: {
      screen: SearchTab
    },
    AddMediaTab: {
      screen: TabedManageCardScreen
    },
    LikesTab: {
      screen: LikesTab
    },
    ProfileTab: {
      screen: ProfileTab
    }
  },
  {
    animationEnabled: true,
    swipeEnabled: true,
    tabBarPosition: 'bottom',
    tabBarOptions: {
      style: {
        ...Platform.select({
          android: {
            backgroundColor: 'white'
          }
        })
      },
      activeTintColor: '#000',
      inactiveTintColor: '#d1cece',
      showLabel: false,
      showIcon: true
    }
  }
);
