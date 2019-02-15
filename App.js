/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 * @lint-ignore-every XPLATJSCOPYRIGHT1
 */

import React from 'react'
import { StyleSheet, Text, View, AppState, Platform, Alert, TouchableHighlight, Button, PushNotificationIOS } from 'react-native'
import { createStackNavigator, createAppContainer } from 'react-navigation'
import MainScreen from './src/Components/MainScreen'
import PushNotification from 'react-native-push-notification'
import Moment from "moment";

export default class App extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      time: '15:12:00'
    }; 

    PushNotification.configure({

     onRegister: function(token) {
        
     },

     onNotification: function(notification) {      
        notification.finish(PushNotificationIOS.FetchResult.NoData);
     },

     permissions: {
       alert: true,
       badge: true,
       sound: true
     },

     popInitialNotification: true,
     requestPermissions: true,

    });
  }

  componentDidMount(){
    this.fireNotification();
  }

  fireNotification(){
    const _date = Moment(new Date()).format("YYYY-MM-DD");
    const date = new Date(_date + ' ' + this.state.time);
    console.log(Moment(date).format("YYYY-MM-DD hh:mm:ss A"));

    PushNotification.localNotificationSchedule({
        message: "Hello Friend, you have new notfication",
        title: "My App Title",
        subText: "Sub Title of notification",
        color: "red",
        repeatType: "day",
        foreground: true,
        date: new Date(Date.now() + (60 * 1000))
      });
  }

  render() {
    return (
        <AppContainer />
    );
  }
}

const AppStackNavigator = createStackNavigator({
  Main: {
    screen: MainScreen
  }
})

const AppContainer = createAppContainer(AppStackNavigator);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
