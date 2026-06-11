import React from "react";
import {
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../../app/navigation/types";
import { useLanguage } from "../../../Screens/language/LanguageContext";

type Nav = NativeStackNavigationProp<RootStackParamList, "AuthChoiceScreen">;

export default function AuthChoiceScreen() {
  const navigation = useNavigation<Nav>();
  const { t } = useLanguage();

  return (
    <LinearGradient colors={["#070712", "#101035", "#171753"]} style={styles.container}>
      <SafeAreaView style={styles.safe}>
        <View style={styles.glowOne} />
        <View style={styles.glowTwo} />

        <View style={styles.header}>
          <View style={styles.logoBadge}>
            <Text style={styles.logoIcon}>🧠</Text>
          </View>

          <Text style={styles.logo}>MEMOLY</Text>
          <Text style={styles.subLogo}>MEMORY BATTLE ARENA</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.title}>{t.authQuestion}</Text>
          <Text style={styles.subtitle}>
            Oyuna başlamak için giriş yöntemini seç.
          </Text>

          <TouchableOpacity
            style={styles.primaryButton}
            onPress={() => navigation.navigate("GuestRegisterScreen")}
            activeOpacity={0.9}
          >
            <LinearGradient
              colors={["#8E7CFF", "#6C5CE7", "#00D2FF"]}
              style={styles.buttonGradient}
            >
              <Text style={styles.primaryText}>⚡ {t.continueAsGuest}</Text>
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={() => navigation.navigate("EmailRegisterScreen")}
            activeOpacity={0.85}
          >
            <Text style={styles.secondaryText}>📩 {t.registerWithEmail}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.loginButton}
            onPress={() => navigation.navigate("LoginScreen")}
            activeOpacity={0.85}
          >
            <Text style={styles.loginText}>🔐 {t.login}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.offlineButton}
            onPress={() => navigation.navigate("HomeScreen")}
            activeOpacity={0.85}
          >
            <Text style={styles.offlineText}>🎮 Offline Oyna</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },

  safe: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 40,
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

  header: {
    alignItems: "center",
    marginBottom: 32,
  },

  logoBadge: {
    width: 86,
    height: 86,
    borderRadius: 28,
    backgroundColor: "rgba(255,255,255,0.08)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.16)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },

  logoIcon: {
    fontSize: 42,
  },

  logo: {
    fontSize: 42,
    fontWeight: "900",
    color: "#FFFFFF",
    letterSpacing: 3,
  },

  subLogo: {
    marginTop: 6,
    color: "#00D2FF",
    fontSize: 12,
    fontWeight: "900",
    letterSpacing: 2,
  },

  card: {
    width: "100%",
    borderRadius: 28,
    padding: 18,
    backgroundColor: "rgba(255,255,255,0.08)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.16)",
  },

  title: {
    fontSize: 24,
    fontWeight: "900",
    color: "#FFFFFF",
    textAlign: "center",
  },

  subtitle: {
    marginTop: 8,
    marginBottom: 24,
    fontSize: 14,
    color: "#D8D8F0",
    textAlign: "center",
    fontWeight: "700",
    lineHeight: 20,
  },

  primaryButton: {
    width: "100%",
    borderRadius: 22,
    overflow: "hidden",
    marginBottom: 13,
    shadowColor: "#00D2FF",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.28,
    shadowRadius: 18,
    elevation: 10,
  },

  buttonGradient: {
    paddingVertical: 17,
    alignItems: "center",
  },

  primaryText: {
    color: "#FFFFFF",
    fontSize: 17,
    fontWeight: "900",
  },

  secondaryButton: {
    width: "100%",
    paddingVertical: 16,
    borderRadius: 20,
    marginBottom: 13,
    backgroundColor: "rgba(0,210,255,0.10)",
    borderWidth: 1,
    borderColor: "rgba(0,210,255,0.32)",
    alignItems: "center",
  },

  secondaryText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "900",
  },

  loginButton: {
    width: "100%",
    paddingVertical: 16,
    borderRadius: 20,
    marginBottom: 13,
    backgroundColor: "rgba(255,255,255,0.08)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.16)",
    alignItems: "center",
  },

  loginText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "900",
  },

  offlineButton: {
    width: "100%",
    paddingVertical: 16,
    borderRadius: 20,
    backgroundColor: "rgba(250,204,21,0.12)",
    borderWidth: 1,
    borderColor: "rgba(250,204,21,0.35)",
    alignItems: "center",
  },

  offlineText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "900",
  },
});