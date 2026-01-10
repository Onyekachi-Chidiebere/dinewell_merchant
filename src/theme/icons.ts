import Bell from '../assets/icons/notification_bell.svg';
import Warning from '../assets/icons/warning.svg';

export const icons = {
  notification: require('../assets/images/notification.svg'),
  arrowUp: require('../assets/images/arrow-up.svg'),
  arrowDown: require('../assets/images/arrow-down.svg'),
  qrCode: require('../assets/images/qr-code.svg'),
  bell: Bell,
  warning: Warning,
} as const;

export type Icons = typeof icons;
export type IconKeys = keyof typeof icons;

export default icons; 