/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';

// Register the app first so a push setup failure cannot blank the UI.
AppRegistry.registerComponent(appName, () => App);

try {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const {setupBackgroundHandlers} = require('./src/services/pushNotifications');
  setupBackgroundHandlers();
} catch (error) {
  console.error('Failed to init push background handlers:', error);
}
