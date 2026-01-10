import React from "react";
import { Text, StyleSheet, SafeAreaView, View, TouchableOpacity, Dimensions } from "react-native";
import LinearGradient from "react-native-linear-gradient";
import colors from "../theme/colors";

const { width } = Dimensions.get("window");

const Landing = ({ navigation }: { navigation: any }) => {
    return (
        <LinearGradient
            colors={["#F6BD87", "#FFF6ED", "#FFFFFF"]}
            locations={[0, 0.45, 1]}
            start={{ x: 0.5, y: 0 }}
            end={{ x: 0.5, y: 1 }}
            style={styles.container}
        >
            <SafeAreaView style={{ flex: 1 }}>
                <View style={styles.contentWrapper}>
                    <Text style={styles.welcomeText}>Welcome to</Text>
                    <Text style={styles.logoText}>
                        Dine
                        <Text style={styles.logoTextWell}>Well</Text>
                    </Text>
                </View>
                <View style={styles.bottomWrapper}>
                    <Text style={styles.subText}>Sign Up/Login below</Text>
                    <TouchableOpacity onPress={()=>navigation.navigate('RestaurantDetails')} style={styles.button} activeOpacity={0.8}>
                        <Text style={styles.buttonText}>Sign up to Dine Well</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={()=>navigation.navigate('Login')} style={styles.button} activeOpacity={0.8}>
                        <Text style={styles.buttonText}>Log In to Dine Well</Text>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        </LinearGradient>
    );
};

export default Landing;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentWrapper: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 40,
  },
  welcomeText: {
    fontSize: 22,
    color: "#8B8B9A",
    textAlign: "center",
    marginBottom: 12,
    fontWeight: "400",
    letterSpacing: 0.2,
  },
  logoText: {
    fontSize: 48,
    fontWeight: "700",
    color: "#8B7CF6",
    textAlign: "center",
    letterSpacing: 0.5,
    lineHeight: 56,
  },
  logoTextWell: {
    color: "#F57C1F",
  },
  bottomWrapper: {
    alignItems: "center",
    marginBottom: 48,
  },
  subText: {
    fontSize: 16,
    color: "#8B8B9A",
    marginBottom: 12,
    textAlign: "center",
    fontWeight: "400",
  },
  button: {
    width: width - 48,
    backgroundColor: "#fff",
    borderRadius: 40,
    borderWidth: 1,
    borderColor: "#C4CBF2",
    paddingVertical: 22,
    alignItems: "center",
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#18181B",
  },
});