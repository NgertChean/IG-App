import React, { Component } from 'react';
import { Platform } from 'react-native';

import HomeTab from './AppTabNavigator/HomeTab';
import SearchTab from './AppTabNavigator/SearchTab';
import TabedManageCardScreen from './AppTabNavigator/TabedManageCardScreen';
import LikesTab from './AppTabNavigator/LikesTab';
import WatchedTab from './AppTabNavigator/WatchedTab';
import ProfileTab from './AppTabNavigator/ProfileTab';
import StackedManageCardScreen from './StackedManageCardScreen';
import StackedManageTrelloVideoCard from './VideoComponents/StackedManageTrelloVideoCard'

import { createBottomTabNavigator, createStackNavigator, createAppContainer } from 'react-navigation';
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

const AppTabNavigator = createAppContainer( createBottomTabNavigator(
  {
    HomeTab: {
      screen: createAppContainer(createStackNavigator({
        HomeScreen: { screen: HomeTab },
        ManageCardScreen: { screen: StackedManageCardScreen }
      })),
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
      screen: createAppContainer(createStackNavigator({
        LikesScreen: { screen: LikesTab },
        ManageVideoScreen: { screen: StackedManageTrelloVideoCard }
      })),
      navigationOptions: {
        tabBarIcon: ({ tintColor }) => <Icon name="ios-heart" style={{ color: tintColor }} />
      }
    },
    WacthedTab: {
      screen: createAppContainer(createStackNavigator({
        WacthedScreen: { screen: WatchedTab },
        ManageVideoScreen: { screen: StackedManageTrelloVideoCard }
      })),
      navigationOptions: {
        tabBarIcon: ({ tintColor }) => <Icon name="ios-eye" style={{ color: tintColor }} />
      }
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
));
