import React, { useCallback, useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Toast from 'react-native-toast-message';
import colors from '../theme/colors';
import typography from '../theme/typography';
import { ArrowLeftIcon, FaceIdIcon, SecurityIcon } from '../assets/icons';
import {
  authenticateBiometric,
  getBiometricSupport,
  isBiometricEnabled,
  setBiometricEnabled,
} from '../services/biometricAuth';

type RootStackParamList = {
  Profile: undefined;
  ChangePassword: undefined;
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const SecurityScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const [isBiometricOn, setIsBiometricOn] = useState(false);
  const [biometricLabel, setBiometricLabel] = useState('Biometrics');
  const [isAvailable, setIsAvailable] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);

  const loadBiometricSettings = useCallback(async () => {
    setIsLoading(true);
    try {
      const [support, enabled] = await Promise.all([
        getBiometricSupport(),
        isBiometricEnabled(),
      ]);
      setBiometricLabel(support.label);
      setIsAvailable(support.available);
      setIsBiometricOn(enabled && support.available);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadBiometricSettings();
  }, [loadBiometricSettings]);

  const handleBiometricToggle = async () => {
    if (!isAvailable || isUpdating) {
      return;
    }

    setIsUpdating(true);
    try {
      if (isBiometricOn) {
        await setBiometricEnabled(false);
        setIsBiometricOn(false);
        Toast.show({
          type: 'success',
          text1: `${biometricLabel} disabled`,
        });
        return;
      }

      const success = await authenticateBiometric(
        `Enable ${biometricLabel} for DineWell Merchant`,
      );

      if (!success) {
        Toast.show({
          type: 'info',
          text1: `${biometricLabel} not enabled`,
          text2: 'Authentication was cancelled or failed.',
        });
        return;
      }

      await setBiometricEnabled(true);
      setIsBiometricOn(true);
      Toast.show({
        type: 'success',
        text1: `${biometricLabel} enabled`,
        text2: 'Sign in once with email to finish setup, then use biometrics to unlock and sign in.',
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const menuItems = [
    {
      id: 1,
      title: biometricLabel,
      subtitle: isAvailable
        ? 'Unlock the app and sign in with biometrics'
        : 'Biometrics are not available on this device',
      isToggle: true,
      isEnabled: isBiometricOn,
      isDisabled: !isAvailable || isLoading || isUpdating,
      icon: FaceIdIcon,
    },
    {
      id: 2,
      title: 'Change Password',
      subtitle: 'Change your password',
      isToggle: false,
      icon: SecurityIcon,
    },
  ];

  const handleItemPress = (id: number) => {
    if (id === 1) {
      handleBiometricToggle();
      return;
    }
    if (id === 2) {
      navigation.navigate('ChangePassword');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <View style={styles.headerLeft}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => navigation.goBack()}
            >
              <ArrowLeftIcon width={24} height={24} color={colors.border.subtle} />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Security</Text>
          </View>
        </View>
      </View>

      <View style={styles.content}>
        <View style={styles.menuGroup}>
          {menuItems.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={[
                styles.menuItem,
                item.isDisabled ? styles.menuItemDisabled : null,
              ]}
              onPress={() => handleItemPress(item.id)}
              disabled={item.isDisabled}
              activeOpacity={0.7}
            >
              <View style={styles.menuItemLeft}>
                <View style={styles.iconContainer}>
                  <item.icon width={24} height={24} color={colors.primary.middle} />
                </View>
                <View style={styles.menuItemContent}>
                  <Text style={styles.menuItemTitle}>{item.title}</Text>
                  <Text style={styles.menuItemSubtitle}>{item.subtitle}</Text>
                </View>
              </View>
              {item.isToggle && (
                isUpdating && item.id === 1 ? (
                  <ActivityIndicator size="small" color={colors.primary.main} />
                ) : (
                  <View
                    style={[
                      styles.toggle,
                      item.isEnabled ? styles.toggleActive : styles.toggleInactive,
                    ]}
                  >
                    <View
                      style={[
                        styles.toggleCircle,
                        item.isEnabled
                          ? styles.toggleCircleActive
                          : styles.toggleCircleInactive,
                      ]}
                    />
                  </View>
                )
              )}
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.paper,
  },
  header: {
    backgroundColor: colors.background.darksubtle,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    paddingBottom: 15,
  },
  headerContent: {
    backgroundColor: colors.background.subtle,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 20,
    paddingTop: 80,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  backButton: {
    width: 32,
    height: 32,
    borderRadius: 24,
    backgroundColor: colors.background.default,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    ...typography.subtitle1,
    color: colors.text.secondary,
    fontSize: 16,
    fontWeight: '700',
  },
  content: {
    padding: 16,
  },
  menuGroup: {
    gap: 16,
  },
  menuItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.background.default,
    padding: 12,
    borderRadius: 12,
    borderWidth: 0.4,
    borderColor: colors.border.subtle,
  },
  menuItemDisabled: {
    opacity: 0.6,
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 1,
    paddingRight: 8,
  },
  iconContainer: {
    width: 32,
    height: 32,
    borderRadius: 40,
    backgroundColor: colors.background.subtle,
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuItemContent: {
    gap: 4,
    flex: 1,
  },
  menuItemTitle: {
    ...typography.subtitle2,
    color: colors.text.primary,
    fontWeight: '600',
  },
  menuItemSubtitle: {
    ...typography.caption,
    color: colors.text.tertiary,
  },
  toggle: {
    width: 32,
    height: 20,
    borderRadius: 40,
    padding: 2,
    borderWidth: 0.4,
  },
  toggleActive: {
    backgroundColor: colors.primary.main,
    borderColor: colors.primary.main,
  },
  toggleInactive: {
    backgroundColor: colors.background.paper,
    borderColor: colors.border.subtle,
  },
  toggleCircle: {
    width: 16,
    height: 16,
    borderRadius: 8,
  },
  toggleCircleActive: {
    backgroundColor: colors.text.white,
    transform: [{ translateX: 12 }],
  },
  toggleCircleInactive: {
    backgroundColor: colors.border.subtle,
    transform: [{ translateX: 0 }],
  },
});

export default SecurityScreen;
