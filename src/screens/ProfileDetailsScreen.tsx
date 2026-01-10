import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import colors from '../theme/colors';
import typography from '../theme/typography';
import { ArrowLeftIcon, CalendarIcon, ChevronDownIcon } from '../assets/icons';

type RootStackParamList = {
  Profile: undefined;
  AccountSettings: undefined;
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const ProfileDetailsScreen = () => {
  const navigation = useNavigation<NavigationProp>();

  const handleBack = () => {
    navigation.goBack();
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
            <Text style={styles.headerTitle}>Profile Details</Text>
          </View>
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Profile Picture</Text>
          <View style={styles.profilePictureContainer}>
            <View style={styles.avatarContainer}>
              <Image
                source={require('../assets/images/avatar.png')}
                style={styles.avatar}
              />
            </View>
            <TouchableOpacity style={styles.changeButton}>
              <Text style={styles.changeButtonText}>Change</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Username</Text>
          <View style={styles.inputField}>
            <Text style={styles.inputText}>senSÉ</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Profile Details</Text>
          <View style={styles.inputField}>
            <Text style={styles.inputText}>John Okor</Text>
          </View>
          <View style={styles.inputField}>
            <Text style={styles.inputText}>ideastoimpact.sense@gmail.com</Text>
          </View>
          <View style={styles.inputField}>
            <Text style={styles.inputText}>02/06</Text>
            <View style={styles.inputIcon}>
              <CalendarIcon width={24} height={24} color={colors.text.tertiary} />
            </View>
          </View>
          <View style={styles.inputField}>
            <Text style={styles.inputText}>Male</Text>
            <View style={styles.inputIcon}>
              <ChevronDownIcon width={24} height={24} color={colors.text.tertiary} />
            </View>
          </View>
        </View>

        <View style={styles.buttonSection}>
          <TouchableOpacity style={styles.updateButton}>
            <Text style={styles.updateButtonText}>Update profile</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
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
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  section: {
    gap: 16,
    paddingBottom: 16,
    borderBottomWidth: 0.2,
    borderBottomColor: '#EBEEFF',
    marginBottom: 16,
  },
  sectionTitle: {
    ...typography.caption,
    color: colors.text.tertiary,
    fontFamily: 'RedHatDisplay-Medium',
  },
  profilePictureContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#EFDCDA',
    borderRadius: 999,
    paddingVertical: 8,
    gap: 10,
    paddingHorizontal: 12,
  },
  avatarContainer: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: colors.primary.main,
    overflow: 'hidden',
  },
  avatar: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  changeButton: {
    backgroundColor: '#EFDCDA',
    paddingHorizontal: 8,
    paddingVertical: 8,
    borderRadius: 999,
    borderWidth: 0.4,
    borderColor: '#D99994',
  },
  changeButtonText: {
    ...typography.caption,
    color: colors.text.primary,
    fontFamily: 'RedHatDisplay-Regular',
  },
  inputField: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 2,
    paddingLeft: 16,
    paddingRight: 2,
    backgroundColor: colors.background.subtle,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: '#EFDCDA',
    height: 48,
  },
  inputText: {
    ...typography.subtitle2,
    color: colors.text.primary,
    fontFamily: 'Mulish-SemiBold',
    letterSpacing: -0.4,
  },
  inputIcon: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background.subtle,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: '#EBEEFF',
  },
  buttonSection: {
    alignItems: 'center',
    paddingBottom: 32,
  },
  updateButton: {
    backgroundColor: colors.primary.main,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: '#FEDDDB',
    width: 127,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000000',
    shadowOffset: {
      width: 4,
      height: 8,
    },
    shadowOpacity: 0.2,
    shadowRadius: 20,
    elevation: 5,
  },
  updateButtonText: {
    fontFamily: 'MavenPro-SemiBold',
    fontSize: 12,
    lineHeight: 9.6,
    letterSpacing: -0.4,
    color: '#FFFFFF',
    textAlign: 'center',
  },
});

export default ProfileDetailsScreen; 