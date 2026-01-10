import React from "react";
import { View, Text, StyleSheet, TextInput, TouchableOpacity,Alert, Dimensions, SafeAreaView, Pressable, Image } from "react-native";
import colors from "../theme/colors";
import PictureIcon from "../assets/icons/picture.svg";
import LinearGradient from "react-native-linear-gradient";
import BackButton from "../components/BackButton";
import { useSignupContext } from '../context/SignupContext';
import { launchImageLibrary } from 'react-native-image-picker';

const { width, height } = Dimensions.get("window");

const ICON_SIZE = 32;
const PICTURE_SIZE = 64;

const RestaurantPictures = ({ navigation }: { navigation: any }) => {
  const { restaurantDetails, handleLogoPick, handleAddPicture, submitPictures, loading } = useSignupContext();

  // Pick image for logo
  const pickLogo = async () => {
    launchImageLibrary({ mediaType: 'photo', quality: 0.7 }, (response) => {
      if (response.didCancel || response.errorCode) return;
      if (response.assets && response.assets.length > 0) {
        handleLogoPick(response.assets[0]);
      }
    });
  };

  // Pick image for restaurant pictures at index
  const pickPictureAtIndex = (index:any) => {
    launchImageLibrary({ mediaType: 'photo', quality: 0.7 }, (response) => {
      if (response.didCancel || response.errorCode) return;
      if (response.assets && response.assets.length > 0) {
        handleAddPicture(index, response.assets[0]);
      }
    });
  };

  const handleNext = async () => {
    try {
      await submitPictures();
      
      navigation.navigate('Login');
    } catch (err) {
      Alert.alert('Failed to upload pictures. Please try again.');
    }
  };

  return (
    <LinearGradient
      colors={["#F6BD87", "#FFF6ED", "#FFFFFF"]}
      locations={[0, 0.45, 1]}
      start={{ x: 0.5, y: 0 }}
      end={{ x: 0.5, y: 1 }}
      style={styles.container}
    >
      <SafeAreaView style={{ flex: 1 }}>
        <View style={styles.backButtonWrapper}><BackButton/>
          <Pressable><Text>Skip</Text></Pressable>
        </View>
        <View style={styles.outerWrapper}>
          <View style={styles.headerWrapper}>
            <Text style={styles.title}>{"Your\nPictures"}</Text>
          </View>
          <View style={styles.formWrapper}>
            {/* Logo Input */}
            <View style={styles.logoInputWrapper}>
              <TextInput
                style={styles.logoInput}
                placeholder="Logo"
                placeholderTextColor="#AEB5C3"
                value={restaurantDetails.logo && restaurantDetails.logo.fileName ? restaurantDetails.logo.fileName : ''}
                editable={false}
              />
              <TouchableOpacity style={styles.logoIconWrapper} activeOpacity={0.7} onPress={pickLogo}>
                {restaurantDetails.logo && restaurantDetails.logo.uri ? (
                  <Image source={{ uri: restaurantDetails.logo.uri }} style={styles.logoImage} />
                ) : (
                  <PictureIcon width={ICON_SIZE} height={ICON_SIZE} />
                )}
              </TouchableOpacity>
            </View>
            {/* Restaurant Pictures Section */}
            <View style={styles.picturesSection}>
              <Text style={styles.picturesLabel}>Restaurant Pictures</Text>
              <View style={styles.picturesRow}>
                {[0, 1, 2, 3].map((i) => (
                  <TouchableOpacity key={i} style={styles.pictureCircle} activeOpacity={0.7} onPress={() => pickPictureAtIndex(i)}>
                    {restaurantDetails.images && restaurantDetails.images[i] && restaurantDetails.images[i].uri ? (
                      <Image source={{ uri: restaurantDetails.images[i].uri }} style={styles.pictureImage} />
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
          <View style={styles.bottomWrapper}>
            <TouchableOpacity style={styles.button} activeOpacity={0.8} onPress={handleNext} disabled={loading}>
              <Text style={styles.buttonText}>{loading ? 'Uploading...' : 'Next'}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
};

export default RestaurantPictures;

const styles = StyleSheet.create({
  title: {
    fontSize: 64,
    fontWeight: "700",
    color: "#454B5E",
    textAlign: "center",
    letterSpacing: 0.5,
    lineHeight: 63,
    textShadowColor: "rgba(69, 75, 94, 0.18)",
    textShadowOffset: { width: 0, height: 4 },
    textShadowRadius: 8,
  },
  headerWrapper: {
    alignItems: "center",
    marginTop: height * 0.09, // push title high up
  },
  backButtonWrapper:{
    flexDirection:'row',
    justifyContent:'space-between',
    alignItems:'center',
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  container: {
    flex: 1,
  },
  outerWrapper: {
    flex: 1,
    justifyContent: "space-between",
  },
  formWrapper: {
    marginTop: 32,
    alignItems: "center",
  },
  logoInputWrapper: {
    width: width - 32,
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 32,
    borderWidth: 1,
    borderColor: "#C4CBF2",
    marginBottom: 24,
    position: "relative",
    height: 64,
  },
  logoInput: {
    flex: 1,
    height: 64,
    paddingLeft: 24,
    paddingRight: 56,
    fontSize: 20,
    fontStyle: "italic",
    color: "#454B5E",
    backgroundColor: "transparent",
  },
  logoIconWrapper: {
    position: "absolute",
    right: 0,
    height: 64,
    width: 64,
    borderTopRightRadius: 32,
    borderBottomRightRadius: 32,
    borderLeftWidth: 1,
    borderLeftColor: "#C4CBF2",
    justifyContent: "center",
    alignItems: "center",
    overflow: 'hidden',
  },
  logoImage: {
    width: ICON_SIZE,
    height: ICON_SIZE,
    borderRadius: ICON_SIZE / 2,
    resizeMode: 'cover',
  },
  picturesSection: {
    width: width - 32,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: "#C4CBF2",
    padding: 16,
    marginBottom: 32,
  },
  picturesLabel: {
    fontSize: 18,
    fontStyle: "italic",
    color: "#8B8B9A",
    marginBottom: 12,
  },
  picturesRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
    paddingHorizontal: 4,
  },
  pictureCircle: {
    width: PICTURE_SIZE,
    height: PICTURE_SIZE,
    borderRadius: PICTURE_SIZE / 2,
    backgroundColor: "#fff",
    borderWidth: 2,
    borderColor: "#C4CBF2",
    justifyContent: "center",
    alignItems: "center",
    overflow: 'hidden',
  },
  pictureImage: {
    width: PICTURE_SIZE - 8,
    height: PICTURE_SIZE - 8,
    borderRadius: (PICTURE_SIZE - 8) / 2,
    resizeMode: 'cover',
  },
  helperWrapper: {
    backgroundColor: "#F1F4FA",
    borderRadius: 16,
    padding: 8,
    marginTop: 4,
  },
  helperText: {
    fontSize: 15,
    color: "#8B8B9A",
    fontWeight: "400",
  },
  bottomWrapper: {
    alignItems: "center",
    marginBottom: 32,
  },
  button: {
    width: width - 32,
    backgroundColor: colors.primary.main,
    borderRadius: 40,
    paddingVertical: 22,
    alignItems: "center",
    shadowColor: "#F6BD87",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.18,
    shadowRadius: 24,
    elevation: 4,
  },
  buttonText: {
    fontSize: 22,
    fontWeight: "700",
    color: "#fff",
  },
});