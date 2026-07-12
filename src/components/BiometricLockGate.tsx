import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  AppState,
  AppStateStatus,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {
  authenticateBiometric,
  getBiometricSupport,
  isBiometricEnabled,
} from '../services/biometricAuth';
import colors from '../theme/colors';
import typography from '../theme/typography';
import { FaceIdIcon } from '../assets/icons';

type BiometricLockGateProps = {
  children: React.ReactNode;
};

const BiometricLockGate = ({ children }: BiometricLockGateProps) => {
  const [isLocked, setIsLocked] = useState(false);
  const [biometricLabel, setBiometricLabel] = useState('Biometrics');
  const appState = useRef(AppState.currentState);
  const shouldLockOnResume = useRef(false);
  const hasAutoPrompted = useRef(false);

  const unlock = useCallback(async () => {
    const success = await authenticateBiometric(
      `Unlock DineWell Merchant with ${biometricLabel}`,
    );
    if (success) {
      setIsLocked(false);
      shouldLockOnResume.current = false;
    }
  }, [biometricLabel]);

  const evaluateLock = useCallback(async (lockImmediately: boolean) => {
    const [enabled, support] = await Promise.all([
      isBiometricEnabled(),
      getBiometricSupport(),
    ]);

    setBiometricLabel(support.label);

    if (!enabled || !support.available) {
      setIsLocked(false);
      shouldLockOnResume.current = false;
      return;
    }

    if (lockImmediately || shouldLockOnResume.current) {
      setIsLocked(true);
    }
  }, []);

  useEffect(() => {
    evaluateLock(true);

    const subscription = AppState.addEventListener(
      'change',
      (nextState: AppStateStatus) => {
        const prevState = appState.current;
        appState.current = nextState;

        if (prevState === 'active' && nextState.match(/inactive|background/)) {
          shouldLockOnResume.current = true;
        }

        if (prevState.match(/inactive|background/) && nextState === 'active') {
          evaluateLock(false);
        }
      },
    );

    return () => subscription.remove();
  }, [evaluateLock]);

  useEffect(() => {
    if (isLocked && !hasAutoPrompted.current) {
      hasAutoPrompted.current = true;
      unlock();
    }

    if (!isLocked) {
      hasAutoPrompted.current = false;
    }
  }, [isLocked, unlock]);

  return (
    <View style={styles.container}>
      {children}
      {isLocked && (
        <View style={styles.overlay}>
          <View style={styles.lockCard}>
            <View style={styles.iconContainer}>
              <FaceIdIcon width={32} height={32} color={colors.primary.middle} />
            </View>
            <Text style={styles.title}>App locked</Text>
            <Text style={styles.subtitle}>
              Use {biometricLabel} to continue using DineWell Merchant.
            </Text>
            <TouchableOpacity style={styles.unlockButton} onPress={unlock}>
              <Text style={styles.unlockButtonText}>Unlock with {biometricLabel}</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(15, 23, 42, 0.92)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    zIndex: 999,
  },
  lockCard: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: colors.background.default,
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    borderWidth: 0.4,
    borderColor: colors.border.subtle,
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.background.subtle,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    ...typography.subtitle1,
    color: colors.text.primary,
    fontWeight: '700',
    marginBottom: 8,
  },
  subtitle: {
    ...typography.body2,
    color: colors.text.secondary,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 20,
  },
  unlockButton: {
    backgroundColor: colors.primary.main,
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 20,
    width: '100%',
  },
  unlockButtonText: {
    ...typography.subtitle2,
    color: colors.text.white,
    fontWeight: '700',
    textAlign: 'center',
  },
});

export default BiometricLockGate;
