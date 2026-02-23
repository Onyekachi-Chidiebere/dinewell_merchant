import React, { useState } from "react";
import { Text, StyleSheet, SafeAreaView, View, TextInput, TouchableOpacity, Dimensions, KeyboardAvoidingView, Platform, Alert, Pressable } from "react-native";
import LinearGradient from "react-native-linear-gradient";
import colors from "../theme/colors";
import { useAppContext } from "../context/AppContext";

const { width, height } = Dimensions.get("window");

const ResetPassword = ({navigation}:any) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login, loginLoading } = useAppContext();

  const onLogin = async () => {
    try {
      await login({ email, password });
      // App navigation will switch automatically via context
    } catch (e) {
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
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === "ios" ? "padding" : undefined}
        >
          <View style={styles.outerWrapper}>
            <View style={styles.headerWrapper}>
              <Text style={styles.title}>{"Reset\nPassword"}</Text>
            </View>
            <View style={styles.formWrapper}>
              <TextInput
                style={styles.input}
                placeholder="Enter New Paassword"
                placeholderTextColor="#8B8B9A"
                value={email}
                onChangeText={setEmail}
                secureTextEntry
                textContentType="password"
                autoCorrect={false}
              />

              <TextInput
                style={styles.input}
                placeholder="Confrim New Pasword"
                placeholderTextColor="#8B8B9A"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                textContentType="password"
                autoCorrect={false}
              />
           
            </View>

            <View style={styles.bottomWrapper}>
              <TouchableOpacity style={styles.button} activeOpacity={0.8} onPress={onLogin} disabled={loginLoading}>
                <Text style={styles.buttonText}>{loginLoading ? 'Resetting' : 'Reset Password'}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </LinearGradient>
  );
};

export default ResetPassword;

const styles = StyleSheet.create({

  container: {
    flex: 1,
  },
  outerWrapper: {
    flex: 1,
    justifyContent: "space-between",
  },
  headerWrapper: {
    alignItems: "center",
    marginTop: height * 0.09, // push title high up
  },
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
  formWrapper: {
    alignItems: "center",
    marginTop: height * 0.04, // large gap after title
  },
  input: {
    width: width - 40,
    height: 64,
    backgroundColor: "#fff",
    borderRadius: 32,
    borderWidth: 1,
    borderColor: "#EAD9D1",
    paddingHorizontal: 28,
    fontSize: 20,
    fontStyle: "italic",
    color: "#454B5E",
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 6,
    elevation: 1,
  },
  bottomWrapper: {
    alignItems: "center",
    marginBottom: height * 0.06, // large margin at the bottom
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