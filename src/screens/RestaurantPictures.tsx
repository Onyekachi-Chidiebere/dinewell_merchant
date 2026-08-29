import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Dimensions,
  SafeAreaView,
  Pressable,
  Image,
  ScrollView,
  Alert,
  Platform,
} from 'react-native';
import colors from '../theme/colors';
import PictureIcon from '../assets/icons/picture.svg';
import LinearGradient from 'react-native-linear-gradient';
import BackButton from '../components/BackButton';
import { useSignupContext } from '../context/SignupContext';
import { launchImageLibrary } from 'react-native-image-picker';

const { width, height } = Dimensions.get('window');
const titleSize = Math.min(48, width * 0.11);
const ICON_SIZE = 32;
const PICTURE_SIZE = Math.min(64, (width - 80) / 4);

const RestaurantPictures = ({ navigation, route }: { navigation: any; route?: any }) => {
  const {
    restaurantDetails,
    handleLogoPick,
    handleAddPicture,
    submitPictures,
    skipPictures,
    ensureMerchantId,
    merchantId,
    loading,
    uploadDebugError,
    clearUploadDebugError,
  } = useSignupContext();
  const routeMerchantId = route?.params?.merchantId;

  useEffect(() => {
    ensureMerchantId(routeMerchantId);
  }, [routeMerchantId, ensureMerchantId]);

  const pickerOptions = {
    mediaType: 'photo' as const,
    quality: 0.55,
    maxWidth: 1024,
    maxHeight: 1024,
    selectionLimit: 1,
    includeBase64: true,
  };

  const pickLogo = () => {
    launchImageLibrary(pickerOptions, (response) => {
      if (response.didCancel || response.errorCode) {
        if (response.errorMessage) {
          Alert.alert('Image picker', response.errorMessage);
        }
        return;
      }
      if (response.assets?.[0]) {
        handleLogoPick(response.assets[0]);
      }
    });
  };

  const pickPictureAtIndex = (index: number) => {
    launchImageLibrary(pickerOptions, (response) => {
      if (response.didCancel || response.errorCode) {
        if (response.errorMessage) {
          Alert.alert('Image picker', response.errorMessage);
        }
        return;
      }
      if (response.assets?.[0]) {
        handleAddPicture(index, response.assets[0]);
      }
    });
  };

  const handleNext = async () => {
    try {
      await submitPictures(routeMerchantId ?? merchantId);
      navigation.navigate('Login');
    } catch (err) {
      // Debug panel stays on screen
    }
  };

  const handleSkip = () => {
    Alert.alert(
      'Skip pictures?',
      'Your account will be finished without pictures. You can add them later from your profile.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Skip',
          onPress: async () => {
            try {
              await skipPictures(routeMerchantId ?? merchantId);
              navigation.navigate('Login');
            } catch (err) {
              // Toast already shown — stay on this screen
            }
          },
        },
      ]
    );
  };

  return (
    <LinearGradient
      colors={['#F6BD87', '#FFF6ED', '#FFFFFF']}
      locations={[0, 0.45, 1]}
      start={{ x: 0.5, y: 0 }}
      end={{ x: 0.5, y: 1 }}
      style={styles.container}
    >
      <SafeAreaView style={{ flex: 1 }}>
        <View style={styles.backButtonWrapper}>
          <BackButton />
          <Pressable onPress={handleSkip} hitSlop={12}>
            <Text style={styles.skipText}>Skip</Text>
          </Pressable>
        </View>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          bounces={false}
        >
          <View style={styles.headerWrapper}>
            <Text style={styles.title}>{'Your\nPictures'}</Text>
            <Text style={styles.merchantIdHint}>
              merchantId: {String(routeMerchantId ?? merchantId ?? 'not set yet')}
            </Text>
          </View>
          <View style={styles.formWrapper}>
            <View style={styles.logoInputWrapper}>
              <TextInput
                style={styles.logoInput}
                placeholder="Logo"
                placeholderTextColor="#AEB5C3"
                value={
                  restaurantDetails.logo?.fileName && restaurantDetails.logo?.uri
                    ? restaurantDetails.logo.fileName
                    : ''
                }
                editable={false}
              />
              <TouchableOpacity style={styles.logoIconWrapper} activeOpacity={0.7} onPress={pickLogo}>
                {restaurantDetails.logo?.uri ? (
                  <Image source={{ uri: restaurantDetails.logo.uri }} style={styles.logoImage} />
                ) : (
                  <PictureIcon width={ICON_SIZE} height={ICON_SIZE} />
                )}
              </TouchableOpacity>
            </View>

            <View style={styles.picturesSection}>
              <Text style={styles.picturesLabel}>Restaurant Pictures</Text>
              <View style={styles.picturesRow}>
                {[0, 1, 2, 3].map((i) => (
                  <TouchableOpacity
                    key={i}
                    style={styles.pictureCircle}
                    activeOpacity={0.7}
                    onPress={() => pickPictureAtIndex(i)}
                  >
                    {restaurantDetails.images?.[i]?.uri ? (
                      <Image
                        source={{ uri: restaurantDetails.images[i].uri }}
                        style={styles.pictureImage}
                      />
                    ) : (
                      <PictureIcon width={ICON_SIZE} height={ICON_SIZE} />
                    )}
                  </TouchableOpacity>
                ))}
              </View>
              <View style={styles.helperWrapper}>
                <Text style={styles.helperText}>
                  These should be pictures from inside and outside your restaurant
                </Text>
              </View>
            </View>
          </View>

          {!!uploadDebugError && (
            <View style={styles.debugPanel}>
              <View style={styles.debugHeader}>
                <Text style={styles.debugTitle}>Test mode — upload error</Text>
                <Pressable onPress={clearUploadDebugError} hitSlop={10}>
                  <Text style={styles.debugDismiss}>Dismiss</Text>
                </Pressable>
              </View>
              <ScrollView
                style={styles.debugScroll}
                nestedScrollEnabled
                showsVerticalScrollIndicator
              >
                <Text selectable style={styles.debugText}>
                  {uploadDebugError}
                </Text>
              </ScrollView>
            </View>
          )}

          <View style={styles.bottomWrapper}>
            <TouchableOpacity
              style={[styles.button, loading && styles.buttonDisabled]}
              activeOpacity={0.8}
              onPress={handleNext}
              disabled={loading}
            >
              <Text style={styles.buttonText}>{loading ? 'Uploading...' : 'Next'}</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
};

export default RestaurantPictures;

const styles = StyleSheet.create({
  title: {
    fontSize: titleSize,
    fontWeight: '700',
    color: '#454B5E',
    textAlign: 'center',
    letterSpacing: 0.5,
    lineHeight: titleSize + 4,
    textShadowColor: 'rgba(69, 75, 94, 0.18)',
    textShadowOffset: { width: 0, height: 4 },
    textShadowRadius: 8,
  },
  headerWrapper: {
    alignItems: 'center',
    marginTop: Math.min(height * 0.04, 32),
    paddingHorizontal: 16,
  },
  merchantIdHint: {
    marginTop: 8,
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '500',
  },
  backButtonWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 8,
  },
  skipText: {
    fontSize: 16,
    color: '#454B5E',
    fontWeight: '600',
  },
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'space-between',
    paddingBottom: 24,
  },
  formWrapper: {
    marginTop: 24,
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  logoInputWrapper: {
    width: width - 32,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 32,
    borderWidth: 1,
    borderColor: '#C4CBF2',
    marginBottom: 20,
    position: 'relative',
    height: 56,
    backgroundColor: '#fff',
  },
  logoInput: {
    flex: 1,
    height: 56,
    paddingLeft: 24,
    paddingRight: 56,
    fontSize: 17,
    fontStyle: 'italic',
    color: '#454B5E',
    backgroundColor: 'transparent',
  },
  logoIconWrapper: {
    position: 'absolute',
    right: 0,
    height: 56,
    width: 56,
    borderTopRightRadius: 32,
    borderBottomRightRadius: 32,
    borderLeftWidth: 1,
    borderLeftColor: '#C4CBF2',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  logoImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    resizeMode: 'cover',
  },
  picturesSection: {
    width: width - 32,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#C4CBF2',
    padding: 16,
    marginBottom: 24,
    backgroundColor: 'rgba(255,255,255,0.55)',
  },
  picturesLabel: {
    fontSize: 16,
    fontStyle: 'italic',
    color: '#8B8B9A',
    marginBottom: 12,
  },
  picturesRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    gap: 8,
  },
  pictureCircle: {
    width: PICTURE_SIZE,
    height: PICTURE_SIZE,
    borderRadius: PICTURE_SIZE / 2,
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: '#C4CBF2',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  pictureImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  helperWrapper: {
    backgroundColor: '#F1F4FA',
    borderRadius: 16,
    padding: 8,
    marginTop: 4,
  },
  helperText: {
    fontSize: 14,
    color: '#8B8B9A',
    fontWeight: '400',
  },
  debugPanel: {
    width: width - 32,
    alignSelf: 'center',
    marginTop: 8,
    marginBottom: 12,
    backgroundColor: '#1F2937',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#F87171',
    padding: 12,
    maxHeight: Math.min(280, height * 0.35),
  },
  debugHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  debugTitle: {
    color: '#FCA5A5',
    fontSize: 13,
    fontWeight: '700',
  },
  debugDismiss: {
    color: '#93C5FD',
    fontSize: 13,
    fontWeight: '600',
  },
  debugScroll: {
    maxHeight: Math.min(220, height * 0.28),
  },
  debugText: {
    color: '#E5E7EB',
    fontSize: 11,
    lineHeight: 16,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
  },
  bottomWrapper: {
    alignItems: 'center',
    marginTop: 12,
    marginBottom: 16,
  },
  button: {
    width: width - 32,
    backgroundColor: colors.primary.main,
    borderRadius: 40,
    paddingVertical: 18,
    alignItems: 'center',
    shadowColor: '#F6BD87',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.18,
    shadowRadius: 24,
    elevation: 4,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonText: {
    fontSize: 20,
    fontWeight: '700',
    color: '#fff',
  },
});
