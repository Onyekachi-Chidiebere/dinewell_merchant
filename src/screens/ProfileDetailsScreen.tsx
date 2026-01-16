import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  TextInput,
  Modal,
  ActivityIndicator,
  Platform,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { launchImageLibrary, ImagePickerResponse, MediaType } from 'react-native-image-picker';
import colors from '../theme/colors';
import typography from '../theme/typography';
import { ArrowLeftIcon, CalendarIcon, ChevronDownIcon } from '../assets/icons';
import { useAppContext } from '../context/AppContext';
import useMerchant from '../customHooks/useMerchant';
import Toast from 'react-native-toast-message';

type RootStackParamList = {
  Profile: undefined;
  AccountSettings: undefined;
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const formatDateForDisplay = (dateString: string): string => {
  if (!dateString) return '';
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return '';
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${month}/${day}`;
  } catch {
    return '';
  }
};

const formatDateForAPI = (dateString: string, originalDate?: string): string => {
  if (!dateString) return '';
  // Assuming format is MM/DD, convert to YYYY-MM-DD
  const [month, day] = dateString.split('/');
  if (!month || !day) return '';
  
  // Try to preserve the original year if available
  let year = new Date().getFullYear();
  if (originalDate) {
    try {
      const original = new Date(originalDate);
      if (!isNaN(original.getTime())) {
        year = original.getFullYear();
      }
    } catch {
      // Use current year if parsing fails
    }
  }
  
  return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
};

const ProfileDetailsScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const { user, updateUser } = useAppContext();
  const { updateProfile, loading } = useMerchant();

  const [restaurantName, setRestaurantName] = useState(user?.restaurant_name || '');
  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [dateOfBirth, setDateOfBirth] = useState(user?.date_of_birth ? formatDateForDisplay(user.date_of_birth) : '');
  const [gender, setGender] = useState(user?.gender || '');
  const [profileImage, setProfileImage] = useState(user?.restaurant_logo || user?.profile_image || '');
  const [selectedImage, setSelectedImage] = useState<any>(null);
  const [showGenderModal, setShowGenderModal] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  const genderOptions = ['Male', 'Female', 'Other', 'Prefer not to say'];

  useEffect(() => {
    if (user) {
      setRestaurantName(user.restaurant_name || '');
      setName(user.name || '');
      setPhone(user.phone || '');
      setDateOfBirth(user.date_of_birth ? formatDateForDisplay(user.date_of_birth) : '');
      setGender(user.gender || '');
      setProfileImage(user.restaurant_logo || user.profile_image || '');
    }
  }, [user]);

  const handleUpdateProfile = async () => {
    if (!user?.id) return;

    try {
      setIsUpdating(true);
      
      // Check if there are any changes
      const hasRestaurantNameChange = restaurantName && restaurantName !== user.restaurant_name;
      const hasNameChange = name && name !== user.name;
      const hasPhoneChange = phone && phone !== user.phone;
      const hasDateChange = dateOfBirth && dateOfBirth !== formatDateForDisplay(user.date_of_birth || '');
      const hasGenderChange = gender && gender !== user.gender;
      const hasImageChange = selectedImage || (profileImage && profileImage !== (user.restaurant_logo || user.profile_image));

      if (!hasRestaurantNameChange && !hasNameChange && !hasPhoneChange && !hasDateChange && !hasGenderChange && !hasImageChange) {
        Toast.show({
          type: 'info',
          text1: 'No changes',
          text2: 'No changes to update',
        });
        setIsUpdating(false);
        return;
      }

      // If there's an image, use FormData, otherwise use JSON
      const response = await updateProfile(user.id, {
        restaurantName: hasRestaurantNameChange ? restaurantName : undefined,
        name: hasNameChange ? name : undefined,
        phone: hasPhoneChange ? phone : undefined,
        dateOfBirth: hasDateChange ? formatDateForAPI(dateOfBirth, user.date_of_birth) : undefined,
        gender: hasGenderChange ? gender : undefined,
      }, selectedImage);
      
      if (response?.success && response?.merchant) {
        // Update user in context
        updateUser(response.merchant);
        setSelectedImage(null);
        Toast.show({
          type: 'success',
          text1: 'Success',
          text2: 'Profile updated successfully',
        });
        navigation.goBack();
      }
    } catch (error) {
      console.error('Update profile error:', error);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleChangeProfileImage = () => {
    const options = {
      mediaType: 'photo' as MediaType,
      quality: 0.8 as const,
      maxWidth: 1024,
      maxHeight: 1024,
    };

    launchImageLibrary(options, (response: ImagePickerResponse) => {
      if (response.didCancel) {
        return;
      } else if (response.errorMessage) {
        Toast.show({
          type: 'error',
          text1: 'Error',
          text2: response.errorMessage,
        });
      } else if (response.assets && response.assets[0]) {
        const asset = response.assets[0];
        setSelectedImage(asset);
        setProfileImage(asset.uri || '');
      }
    });
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
                source={
                  selectedImage?.uri || profileImage
                    ? { uri: selectedImage?.uri || profileImage }
                    : require('../assets/images/avatar.png')
                }
                style={styles.avatar}
              />
            </View>
            <TouchableOpacity 
              style={styles.changeButton}
              onPress={handleChangeProfileImage}
            >
              <Text style={styles.changeButtonText}>Change</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Restaurant Name</Text>
          <View style={styles.inputField}>
            <TextInput
              style={styles.textInput}
              value={restaurantName}
              onChangeText={setRestaurantName}
              placeholder="Enter restaurant name"
              placeholderTextColor={colors.text.tertiary}
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Profile Details</Text>
          <View style={styles.inputField}>
            <TextInput
              style={styles.textInput}
              value={name}
              onChangeText={setName}
              placeholder="Enter your name"
              placeholderTextColor={colors.text.tertiary}
            />
          </View>
          <View style={[styles.inputField, styles.readOnlyField]}>
            <Text style={styles.inputText}>{user?.email || ''}</Text>
          </View>
          <View style={styles.inputField}>
            <TextInput
              style={styles.textInput}
              value={phone}
              onChangeText={setPhone}
              placeholder="Enter phone number"
              placeholderTextColor={colors.text.tertiary}
              keyboardType="phone-pad"
            />
          </View>
          <View style={styles.inputField}>
            <TextInput
              style={styles.textInput}
              value={dateOfBirth}
              onChangeText={setDateOfBirth}
              placeholder="MM/DD"
              placeholderTextColor={colors.text.tertiary}
            />
            <View style={styles.inputIcon}>
              <CalendarIcon width={24} height={24} color={colors.text.tertiary} />
            </View>
          </View>
          <TouchableOpacity 
            style={styles.inputField}
            onPress={() => setShowGenderModal(true)}
          >
            <Text style={[styles.inputText, !gender && { color: colors.text.tertiary }]}>
              {gender || 'Select gender'}
            </Text>
            <View style={styles.inputIcon}>
              <ChevronDownIcon width={24} height={24} color={colors.text.tertiary} />
            </View>
          </TouchableOpacity>
        </View>

        <View style={styles.buttonSection}>
          <TouchableOpacity 
            style={[styles.updateButton, (isUpdating || loading) && styles.updateButtonDisabled]}
            onPress={handleUpdateProfile}
            disabled={isUpdating || loading}
          >
            {isUpdating || loading ? (
              <ActivityIndicator color="#FFFFFF" size="small" />
            ) : (
              <Text style={styles.updateButtonText}>Update profile</Text>
            )}
          </TouchableOpacity>
        </View>

        {/* Gender Selection Modal */}
        <Modal
          visible={showGenderModal}
          transparent={true}
          animationType="slide"
          onRequestClose={() => setShowGenderModal(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Select Gender</Text>
              {genderOptions.map((option) => (
                <TouchableOpacity
                  key={option}
                  style={[
                    styles.modalOption,
                    gender === option && styles.modalOptionSelected
                  ]}
                  onPress={() => {
                    setGender(option);
                    setShowGenderModal(false);
                  }}
                >
                  <Text style={[
                    styles.modalOptionText,
                    gender === option && styles.modalOptionTextSelected
                  ]}>
                    {option}
                  </Text>
                </TouchableOpacity>
              ))}
              <TouchableOpacity
                style={styles.modalCancelButton}
                onPress={() => setShowGenderModal(false)}
              >
                <Text style={styles.modalCancelText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
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
    marginBottom: 8,
  },
  inputText: {
    ...typography.subtitle2,
    color: colors.text.primary,
    fontFamily: 'Mulish-SemiBold',
    letterSpacing: -0.4,
    flex: 1,
  },
  textInput: {
    ...typography.subtitle2,
    color: colors.text.primary,
    fontFamily: 'Mulish-SemiBold',
    letterSpacing: -0.4,
    flex: 1,
    padding: 0,
  },
  readOnlyField: {
    opacity: 0.6,
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
  updateButtonDisabled: {
    opacity: 0.6,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: colors.background.paper,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    paddingBottom: Platform.OS === 'ios' ? 40 : 20,
  },
  modalTitle: {
    ...typography.subtitle1,
    color: colors.text.primary,
    fontFamily: 'RedHatDisplay-Bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  modalOption: {
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderRadius: 12,
    marginBottom: 8,
    backgroundColor: colors.background.subtle,
  },
  modalOptionSelected: {
    backgroundColor: colors.primary.main,
  },
  modalOptionText: {
    ...typography.subtitle2,
    color: colors.text.primary,
    fontFamily: 'Mulish-SemiBold',
  },
  modalOptionTextSelected: {
    color: '#FFFFFF',
  },
  modalCancelButton: {
    marginTop: 16,
    paddingVertical: 16,
    alignItems: 'center',
  },
  modalCancelText: {
    ...typography.subtitle2,
    color: colors.text.secondary,
    fontFamily: 'Mulish-SemiBold',
  },
});

export default ProfileDetailsScreen;
