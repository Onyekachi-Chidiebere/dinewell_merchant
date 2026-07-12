import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Keychain from 'react-native-keychain';
import ReactNativeBiometrics, { BiometryTypes } from 'react-native-biometrics';

const STORAGE_KEY = 'dinewell_merchant_biometric_enabled';
const KEYCHAIN_SERVICE = 'dinewell_merchant_login';
const rnBiometrics = new ReactNativeBiometrics();

export type BiometricSupport = {
  available: boolean;
  label: string;
};

const getLabelForType = (biometryType?: string) => {
  switch (biometryType) {
    case BiometryTypes.FaceID:
      return 'Face ID';
    case BiometryTypes.TouchID:
      return 'Touch ID';
    case BiometryTypes.Biometrics:
      return 'Biometrics';
    default:
      return 'Biometrics';
  }
};

export const getBiometricSupport = async (): Promise<BiometricSupport> => {
  try {
    const { available, biometryType } = await rnBiometrics.isSensorAvailable();
    return {
      available,
      label: getLabelForType(biometryType),
    };
  } catch {
    return { available: false, label: 'Biometrics' };
  }
};

export const isBiometricEnabled = async (): Promise<boolean> => {
  const value = await AsyncStorage.getItem(STORAGE_KEY);
  return value === 'true';
};

export const setBiometricEnabled = async (enabled: boolean): Promise<void> => {
  await AsyncStorage.setItem(STORAGE_KEY, enabled ? 'true' : 'false');
  if (!enabled) {
    await removeLoginCredentials();
  }
};

export const authenticateBiometric = async (
  promptMessage: string,
): Promise<boolean> => {
  try {
    const { success } = await rnBiometrics.simplePrompt({
      promptMessage,
      cancelButtonText: 'Cancel',
    });
    return success;
  } catch {
    return false;
  }
};

export const saveLoginCredentials = async (
  email: string,
  password: string,
): Promise<void> => {
  await Keychain.setGenericPassword(email, password, {
    service: KEYCHAIN_SERVICE,
    accessControl: Keychain.ACCESS_CONTROL.BIOMETRY_ANY,
    accessible: Keychain.ACCESSIBLE.WHEN_UNLOCKED_THIS_DEVICE_ONLY,
  });
};

export const getLoginCredentials = async (
  promptMessage: string,
): Promise<{ email: string; password: string } | null> => {
  try {
    const credentials = await Keychain.getGenericPassword({
      service: KEYCHAIN_SERVICE,
      authenticationPrompt: {
        title: promptMessage,
        cancel: 'Cancel',
      },
    });

    if (credentials && typeof credentials !== 'boolean') {
      return {
        email: credentials.username,
        password: credentials.password,
      };
    }

    return null;
  } catch {
    return null;
  }
};

export const hasStoredLoginCredentials = async (): Promise<boolean> => {
  return Keychain.hasGenericPassword({ service: KEYCHAIN_SERVICE });
};

export const removeLoginCredentials = async (): Promise<void> => {
  await Keychain.resetGenericPassword({ service: KEYCHAIN_SERVICE });
};

export const canUseBiometricLogin = async (): Promise<{
  available: boolean;
  label: string;
}> => {
  const [enabled, hasCredentials, support] = await Promise.all([
    isBiometricEnabled(),
    hasStoredLoginCredentials(),
    getBiometricSupport(),
  ]);

  return {
    available: enabled && hasCredentials && support.available,
    label: support.label,
  };
};
