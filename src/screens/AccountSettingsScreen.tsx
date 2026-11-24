import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import colors from '../theme/colors';
import typography from '../theme/typography';
import { ArrowLeftIcon, ArrowRightIcon } from '../assets/icons';
import CloseAccountModal from '../components/CloseAccountModal';
import axios from '../api/axios';
import { useAppContext } from '../context/AppContext';
import Toast from 'react-native-toast-message';

type RootStackParamList = {
  AccountSettings: undefined;
  ProfileDetails: undefined;
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const AccountSettingsScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const { logout } = useAppContext();
  const [isModalVisible, setIsModalVisible] = useState(false);

  const handleCloseAccount = () => {
    setIsModalVisible(true);
  };

  const handleCloseModal = () => {
    setIsModalVisible(false);
  };

  const handleSubmitRequest = async (_reason: string, currentPassword: string) => {
    try {
      await axios.delete('/users/me', { data: { password: currentPassword } });
      setIsModalVisible(false);
      await logout();
      Toast.show({ type: 'success', text1: 'Account deleted' });
    } catch (error: any) {
      Toast.show({
        type: 'error',
        text1: 'Unable to delete account',
        text2: error.response?.data?.error || 'Check your password and try again.',
      });
    }
  };

  const menuItems = [
    {
      id: 1,
      title: 'Profile Details',
      subtitle: 'Account name, email, phone',
      onPress: () => navigation.navigate('ProfileDetails'),
    },
    {
      id: 2,
      title: 'Close Account',
      subtitle: 'Deactivate your Dine Well account',
      onPress: handleCloseAccount,
    },
  ];

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
            <Text style={styles.headerTitle}>Account Settings</Text>
          </View>
        </View>
      </View>

      <View style={styles.content}>
        <View style={styles.menuGroup}>
          {menuItems.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={styles.menuItem}
              onPress={item.onPress}
            >
              <View style={styles.menuItemContent}>
                <Text style={styles.menuItemTitle}>{item.title}</Text>
                <Text style={styles.menuItemSubtitle}>{item.subtitle}</Text>
              </View>
              <ArrowRightIcon width={16} height={16} color={colors.border.subtle} />
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <CloseAccountModal
        visible={isModalVisible}
        onClose={handleCloseModal}
        onSubmit={handleSubmitRequest}
      />
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
  menuItemContent: {
    gap: 4,
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

});

export default AccountSettingsScreen;
