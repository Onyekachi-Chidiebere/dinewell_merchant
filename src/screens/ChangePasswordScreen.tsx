import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import colors from '../theme/colors';
import typography from '../theme/typography';
import { ArrowLeftIcon, FaceIdIcon, SecurityIcon } from '../assets/icons';
import FormInput from '../components/FomInput';

type RootStackParamList = {
  Profile: undefined;
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const ChangePasswordScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
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
            <FormInput passsword value={currentPassword} onChangeText={setCurrentPassword} placeholder="Enter your current password" />
        </View>
        <View style={styles.formGroup}>
          <Text style={styles.formLabel}>Confirm New Password</Text>
          <FormInput passsword value={currentPassword} onChangeText={setCurrentPassword} placeholder="Enter your current password" />
          
        </View>
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Change Password</Text>
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