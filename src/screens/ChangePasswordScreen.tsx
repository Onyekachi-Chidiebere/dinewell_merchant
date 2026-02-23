import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import colors from '../theme/colors';
import typography from '../theme/typography';
import { ArrowLeftIcon, FaceIdIcon, SecurityIcon } from '../assets/icons';
import FormInput from '../components/FomInput';
import { useAppContext } from '../context/AppContext';
import axios from '../api/axios';
import Toast from 'react-native-toast-message';

type RootStackParamList = {
  Profile: undefined;
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const ChangePasswordScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const { user } = useAppContext();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChangePassword = async () => {
    // Validation
    if (!currentPassword || !newPassword || !confirmNewPassword) {
      Toast.show({
        type: 'error',
        text1: 'Field Error',
        text2: 'Please fill in all fields'
      });
      return;
    }

    if (newPassword !== confirmNewPassword) {
      Toast.show({
        type: 'error',
        text1: 'Password Error',
        text2: 'New password and confirm password do not match'
      });
      return;
    }

    if (newPassword.length < 6) {
      Toast.show({
        type: 'error',
        text1: 'Password Error',
        text2: 'New password must be at least 6 characters long'
      });
      return;
    }

    if (!user?.id) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'User not found. Please log in again'
      });
      return;
    }

    try {
      setLoading(true);
      const response = await axios.put(`/merchant/${user.id}/password`, {
        currentPassword,
        newPassword,
      });

      if (response.data.success) {
        // Clear form
        setCurrentPassword('');
        setNewPassword('');
        setConfirmNewPassword('');
        Toast.show({
          type: 'success',
          text1: 'Success',
          text2: response.data.message || 'Password changed successfully',

          onHide: () => {
            navigation.goBack();
          },
        }
        );

      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || error.message || 'Failed to change password';
      Alert.alert('Error', errorMessage);
    } finally {
      setLoading(false);
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
            <Text style={styles.headerTitle}>Change Password</Text>
          </View>
        </View>
      </View>

      <View style={styles.content}>
        <View style={styles.form}>
          <View style={styles.formGroup}>
            <Text style={styles.formLabel}>Current Password</Text>
            <FormInput passsword value={currentPassword} onChangeText={setCurrentPassword} placeholder="Enter your current password" />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.formLabel}>New Password</Text>
            <FormInput passsword value={newPassword} onChangeText={setNewPassword} placeholder="Enter your new password" />
          </View>
          <View style={styles.formGroup}>
            <Text style={styles.formLabel}>Confirm New Password</Text>
            <FormInput passsword value={confirmNewPassword} onChangeText={setConfirmNewPassword} placeholder="Confirm your new password" />

          </View>
          <TouchableOpacity
            style={[styles.button, loading && styles.buttonDisabled]}
            onPress={handleChangePassword}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color={colors.text.white} />
            ) : (
              <Text style={styles.buttonText}>Change Password</Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  formGroup: {
    marginBottom: 16,
  },
  formLabel: {
    ...typography.subtitle2,
    color: colors.text.secondary,
    fontSize: 14,
    fontWeight: '700',
  },
  formInput: {
    ...typography.subtitle2,
    color: colors.text.secondary,
    fontSize: 16,
    fontWeight: '400',
    borderWidth: 1,
    borderColor: colors.border.default,
    borderRadius: 50,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 4,
  },
  formInputActive: {
    ...typography.subtitle2,
    color: colors.text.secondary,
    fontSize: 16,
    fontWeight: '400',
    borderWidth: 1,
    borderColor: colors.primary.main,
    borderRadius: 50,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 4,
  },
  button: {
    backgroundColor: colors.primary.main,
    padding: 16,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    ...typography.subtitle2,
    color: colors.text.white,
    fontSize: 16,
    fontWeight: '700',
  },
  form: {
    marginBottom: 16,
  },
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

});

export default ChangePasswordScreen; 