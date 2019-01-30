import React from 'react'
import { StyleSheet, Text, View, AppState, Platform, Alert, TouchableHighlight, Button, PushNotificationIOS } from 'react-native'
import { StackNavigator } from 'react-navigation'
import MainScreen from './Components/MainScreen'
import PushNotification from 'react-native-push-notification'

export default class App extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      time: 60
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
    let date = new Date(Date.now() + (this.state.time * 1000)); 

    PushNotification.localNotificationSchedule({
        message: "Hello Friend, you have new notfication",
        title: "My App Title",
        subText: "Sub Title of notification",
        color: "red",
        repeatType: "day",
        foreground: true,
        date
      });
  }

  render() {
    return (
        <AppStackNavigator />
    );
  }
}

const AppStackNavigator = StackNavigator({
  Main: {
    screen: MainScreen
  }
})

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
