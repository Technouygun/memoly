import React, { useState } from "react";
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Keyboard,
  TouchableWithoutFeedback,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../../firebaseConfig";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../../app/navigation/types";
import { useLanguage } from "../../../Screens/language/LanguageContext";

type Nav = NativeStackNavigationProp<RootStackParamList, "LoginScreen">;

export default function LoginScreen() {
  const navigation = useNavigation<Nav>();
  const { t } = useLanguage();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    Keyboard.dismiss();

    if (!email.trim() || !password.trim()) {
      Alert.alert(t.warning, t.fillAllFields);
      return;
    }

    try {
      setLoading(true);
      await signInWithEmailAndPassword(auth, email.trim(), password);
      navigation.replace("OnlineTabs");
    } catch (error: any) {
      Alert.alert(t.loginError, error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <LinearGradient colors={["#070712", "#101035", "#171753"]} style={styles.container}>
      <SafeAreaView style={styles.safe}>
        <KeyboardAvoidingView
          style={styles.keyboardView}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
          <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
            <ScrollView
              contentContainerStyle={styles.scrollContent}
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}
            >
              <View style={styles.glowOne} />
              <View style={styles.glowTwo} />

              <View style={styles.header}>
                <Text style={styles.logo}>MEMOLY</Text>
                <Text style={styles.subLogo}>LOGIN</Text>
              </View>

              <View style={styles.card}>
                <Text style={styles.title}>{t.login}</Text>
                <Text style={styles.subtitle}>
                  Hesabına giriş yap ve online arenaya devam et.
                </Text>

                <Text style={styles.label}>{t.email}</Text>
                <TextInput
                  style={styles.input}
                  placeholder={t.email}
                  placeholderTextColor="rgba(255,255,255,0.42)"
                  autoCapitalize="none"
                  autoCorrect={false}
                  keyboardType="email-address"
                  returnKeyType="next"
                  value={email}
                  onChangeText={setEmail}
                />

                <Text style={styles.label}>{t.password}</Text>
                <TextInput
                  style={styles.input}
                  placeholder={t.password}
                  placeholderTextColor="rgba(255,255,255,0.42)"
                  secureTextEntry
                  returnKeyType="done"
                  value={password}
                  onChangeText={setPassword}
                  onSubmitEditing={handleLogin}
                />

                <TouchableOpacity
                  style={[styles.primaryButton, loading && styles.disabledButton]}
                  onPress={handleLogin}
                  disabled={loading}
                  activeOpacity={0.9}
                >
                  <LinearGradient
                    colors={["#8E7CFF", "#6C5CE7", "#00D2FF"]}
                    style={styles.buttonGradient}
                  >
                    <Text style={styles.primaryText}>
                      {loading ? t.loggingIn : t.login}
                    </Text>
                  </LinearGradient>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.secondaryButton}
                  onPress={() => {
                    Keyboard.dismiss();
                    navigation.navigate("EmailRegisterScreen");
                  }}
                >
                  <Text style={styles.secondaryText}>{t.noAccountRegister}</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.choiceButton}
                  onPress={() => {
                    Keyboard.dismiss();
                    navigation.navigate("AuthChoiceScreen");
                  }}
                >
                  <Text style={styles.choiceText}>← Giriş Seçenekleri</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  safe: { flex: 1 },
  keyboardView: { flex: 1 },

  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 34,
    paddingBottom: 28,
    justifyContent: "center",
  },

  glowOne: {
    position: "absolute",
    width: 270,
    height: 270,
    borderRadius: 135,
    backgroundColor: "rgba(108,92,231,0.34)",
    top: -90,
    right: -110,
  },
  glowTwo: {
    position: "absolute",
    width: 230,
    height: 230,
    borderRadius: 115,
    backgroundColor: "rgba(0,210,255,0.18)",
    bottom: 80,
    left: -105,
  },

  header: { alignItems: "center", marginBottom: 28 },
  logo: { fontSize: 42, fontWeight: "900", color: "#FFFFFF", letterSpacing: 3 },
  subLogo: {
    marginTop: 6,
    color: "#00D2FF",
    fontSize: 12,
    fontWeight: "900",
    letterSpacing: 2,
  },

  card: {
    borderRadius: 28,
    padding: 18,
    backgroundColor: "rgba(255,255,255,0.08)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.16)",
  },
  title: { color: "#FFFFFF", fontSize: 28, fontWeight: "900", textAlign: "center" },
  subtitle: {
    color: "#D8D8F0",
    fontSize: 14,
    fontWeight: "700",
    textAlign: "center",
    lineHeight: 20,
    marginTop: 8,
    marginBottom: 22,
  },
  label: { color: "#FFFFFF", fontSize: 14, fontWeight: "900", marginBottom: 8 },
  input: {
    height: 52,
    borderRadius: 17,
    backgroundColor: "rgba(255,255,255,0.08)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.16)",
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "800",
    paddingHorizontal: 14,
    marginBottom: 14,
  },

  primaryButton: {
    borderRadius: 22,
    overflow: "hidden",
    marginTop: 8,
    marginBottom: 12,
  },
  disabledButton: { opacity: 0.55 },
  buttonGradient: { paddingVertical: 17, alignItems: "center" },
  primaryText: { color: "#FFFFFF", fontSize: 18, fontWeight: "900" },

  secondaryButton: {
    paddingVertical: 15,
    borderRadius: 19,
    backgroundColor: "rgba(0,210,255,0.10)",
    borderWidth: 1,
    borderColor: "rgba(0,210,255,0.32)",
    alignItems: "center",
    marginBottom: 12,
  },
  secondaryText: { color: "#FFFFFF", fontSize: 15, fontWeight: "900" },

  choiceButton: {
    paddingVertical: 15,
    borderRadius: 19,
    backgroundColor: "rgba(255,255,255,0.07)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.15)",
    alignItems: "center",
  },
  choiceText: { color: "#D8D8F0", fontSize: 15, fontWeight: "900" },
});