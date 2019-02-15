/**
 * @format
 * @lint-ignore-every XPLATJSCOPYRIGHT1
 */

import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import 'babel-polyfill';

console.disableYellowBox = true;
AppRegistry.registerComponent(appName, () => App);
