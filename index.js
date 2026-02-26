/**
 * @format
 */

import { AppRegistry } from 'react-native';
import App from './App';
import { name as appName } from './app.json';
import NotificationService from './src/services/NotificationService/NotificationService';

// ✅ Must be called before AppRegistry
NotificationService.registerBackgroundHandler();
AppRegistry.registerComponent(appName, () => App);
