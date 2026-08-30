import React, { useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  ScrollView,
} from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import LinearGradient from 'react-native-linear-gradient';
import colors from '../theme/colors';
import { useAppContext } from '../context/AppContext';

type PendingStackParamList = {
  Profile: undefined;
};

const PendingApprovalScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<PendingStackParamList>>();
  const { user, logout, refreshApprovalStatus } = useAppContext();
  const [refreshing, setRefreshing] = React.useState(false);

  const checkStatus = useCallback(async () => {
    try {
      await refreshApprovalStatus();
    } catch {
      // ignore — user stays on pending screen
    }
  }, [refreshApprovalStatus]);

  useFocusEffect(
    useCallback(() => {
      checkStatus();
    }, [checkStatus])
  );

  const onRefresh = async () => {
    setRefreshing(true);
    await checkStatus();
    setRefreshing(false);
  };

  return (
    <LinearGradient
      colors={['#F6BD87', '#FFF6ED', '#FFFFFF']}
      locations={[0, 0.45, 1]}
      start={{ x: 0.5, y: 0 }}
      end={{ x: 0.5, y: 1 }}
      style={styles.container}
    >
      <ScrollView
        contentContainerStyle={styles.content}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View style={styles.card}>
          <Text style={styles.badge}>Pending review</Text>
          <Text style={styles.title}>We&apos;re reviewing your restaurant</Text>
          <Text style={styles.subtitle}>
            Thanks for signing up{user?.restaurant_name ? `, ${user.restaurant_name}` : ''}. Your
            account is under review and our team will verify your restaurant shortly.
          </Text>
          <Text style={styles.body}>
            You&apos;ll be notified once your restaurant is approved. Pull down to refresh your
            status, or check back later.
          </Text>
        </View>

        <TouchableOpacity style={styles.secondaryButton} onPress={() => navigation.navigate('Profile')}>
          <Text style={styles.secondaryButtonText}>View profile</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.primaryButton} onPress={checkStatus} disabled={refreshing}>
          {refreshing ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.primaryButtonText}>Check status</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity style={styles.logoutButton} onPress={logout}>
          <Text style={styles.logoutButtonText}>Log out</Text>
        </TouchableOpacity>
      </ScrollView>
    </LinearGradient>
  );
};

export default PendingApprovalScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 72,
    paddingBottom: 40,
    justifyContent: 'center',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 24,
    padding: 24,
    borderWidth: 1,
    borderColor: '#E8EAF6',
    marginBottom: 24,
  },
  badge: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(130, 141, 169, 0.12)',
    color: '#828DA9',
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#18181B',
    marginBottom: 12,
    lineHeight: 34,
  },
  subtitle: {
    fontSize: 16,
    color: '#454B5E',
    lineHeight: 24,
    marginBottom: 12,
  },
  body: {
    fontSize: 14,
    color: '#828DA9',
    lineHeight: 22,
  },
  primaryButton: {
    backgroundColor: colors.primary.main,
    borderRadius: 40,
    paddingVertical: 18,
    alignItems: 'center',
    marginBottom: 12,
  },
  primaryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  secondaryButton: {
    backgroundColor: '#fff',
    borderRadius: 40,
    borderWidth: 1,
    borderColor: '#C4CBF2',
    paddingVertical: 18,
    alignItems: 'center',
    marginBottom: 12,
  },
  secondaryButtonText: {
    color: '#18181B',
    fontSize: 16,
    fontWeight: '600',
  },
  logoutButton: {
    alignItems: 'center',
    paddingVertical: 12,
  },
  logoutButtonText: {
    color: colors.primary.main,
    fontSize: 15,
    fontWeight: '600',
  },
});
