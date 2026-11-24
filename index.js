/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';

// Register the app first so a push setup failure cannot blank the UI.
AppRegistry.registerComponent(appName, () => App);

try {

  const {setupBackgroundHandlers} = require('./src/services/pushNotifications');
  setupBackgroundHandlers();
} catch {}
