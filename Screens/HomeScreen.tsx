import React from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Dimensions,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useNavigation } from "@react-navigation/native";
import { useLanguage } from "../Screens/language/LanguageContext";

const { width } = Dimensions.get("window");

export default function HomeScreen() {
  const navigation = useNavigation<any>();
  const { t } = useLanguage();

  return (
    <LinearGradient
      colors={["#070712", "#101035", "#171753"]}
      style={styles.container}
    >
      <View style={{ height: 10}} />
      <View style={styles.glowOne} />
      <View style={styles.glowTwo} />

      <View style={styles.header}>
        <TouchableOpacity
          style={styles.langButton}
          onPress={() => navigation.navigate("LanguageScreen")}
          activeOpacity={0.85}
        >
          <Text style={styles.langText}>🌐 {t.languageSettings}</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.hero}>
        <View style={styles.logoBadge}>
          <Text style={styles.logoIcon}>🧠</Text>
        </View>

        <Text style={styles.logo}>MEMOLY</Text>
        <Text style={styles.slogan}>MEMORY BATTLE ARENA</Text>

        <Text style={styles.title}>{t.homeTitle}</Text>
        <Text style={styles.description}>{t.homeDescription}</Text>

        <View style={styles.card}>
          <View style={styles.cardRow}>
            <View style={styles.miniCard} />
            <View style={styles.miniCard} />
            <View style={styles.miniCardActive} />
            <View style={styles.miniCard} />
          </View>

          <Text style={styles.cardTitle}>Hafızanı Test Et</Text>
          <Text style={styles.cardText}>
            Online rakiplerle eşleş, kartları bul, ödülleri topla.
          </Text>
        </View>
      </View>

      <View style={styles.bottom}>
        <TouchableOpacity
          style={styles.playButton}
          onPress={() => navigation.navigate("AuthChoiceScreen")}
          activeOpacity={0.9}
        >
          <LinearGradient
            colors={["#8E7CFF", "#6C5CE7", "#00D2FF"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.playGradient}
          >
            <Text style={styles.playButtonText}>{t.play}</Text>
            <Text style={styles.buttonSubText}>{t.onlineMode}</Text>
          </LinearGradient>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.offlineButton}
          onPress={() => navigation.navigate("OfflineModesScreen")}
          activeOpacity={0.85}
        >
          <Text style={styles.offlineButtonText}>⚡ {t.offlineModes}</Text>
        </TouchableOpacity>
      </View>
      <View style={{ height: 30}} />
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 54,
    paddingBottom: 28,
  },

  glowOne: {
    position: "absolute",
    width: 260,
    height: 260,
    borderRadius: 130,
    backgroundColor: "rgba(108, 92, 231, 0.35)",
    top: -70,
    right: -90,
  },

  glowTwo: {
    position: "absolute",
    width: 240,
    height: 240,
    borderRadius: 120,
    backgroundColor: "rgba(0, 210, 255, 0.18)",
    bottom: 120,
    left: -110,
  },

  header: {
    width: "100%",
    alignItems: "flex-end",
  },

  langButton: {
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 999,
    backgroundColor: "rgba(255,255,255,0.08)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.16)",
  },

  langText: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "800",
  },

  hero: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },

  logoBadge: {
    width: 92,
    height: 92,
    borderRadius: 30,
    backgroundColor: "rgba(255,255,255,0.08)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.18)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },

  logoIcon: {
    fontSize: 44,
  },

  logo: {
    fontSize: 48,
    fontWeight: "900",
    color: "#FFFFFF",
    letterSpacing: 3,
  },

  slogan: {
    marginTop: 6,
    fontSize: 12,
    fontWeight: "900",
    color: "#00D2FF",
    letterSpacing: 2,
  },

  title: {
    marginTop: 24,
    fontSize: 25,
    fontWeight: "900",
    color: "#FFFFFF",
    textAlign: "center",
  },

  description: {
    marginTop: 10,
    fontSize: 15,
    color: "#D8D8F0",
    textAlign: "center",
    lineHeight: 22,
    maxWidth: width - 58,
  },

  card: {
    width: "100%",
    marginTop: 30,
    padding: 18,
    borderRadius: 26,
    backgroundColor: "rgba(255,255,255,0.08)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.16)",
  },

  cardRow: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 16,
  },

  miniCard: {
    flex: 1,
    height: 52,
    borderRadius: 14,
    backgroundColor: "rgba(255,255,255,0.10)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.12)",
  },

  miniCardActive: {
    flex: 1,
    height: 52,
    borderRadius: 14,
    backgroundColor: "#00D2FF",
  },

  cardTitle: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "900",
  },

  cardText: {
    marginTop: 6,
    color: "#CFCFE6",
    fontSize: 13,
    fontWeight: "600",
    lineHeight: 19,
  },

  bottom: {
    width: "100%",
  },

  playButton: {
    width: "100%",
    borderRadius: 22,
    overflow: "hidden",
    marginBottom: 14,
    shadowColor: "#00D2FF",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.35,
    shadowRadius: 18,
    elevation: 10,
  },

  playGradient: {
    paddingVertical: 18,
    alignItems: "center",
  },

  playButtonText: {
    color: "#FFFFFF",
    fontSize: 23,
    fontWeight: "900",
  },

  buttonSubText: {
    color: "#F1F0FF",
    fontSize: 13,
    fontWeight: "800",
    marginTop: 3,
  },

  offlineButton: {
    width: "100%",
    paddingVertical: 17,
    borderRadius: 20,
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.08)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.18)",
  },

  offlineButtonText: {
    color: "#FFFFFF",
    fontSize: 17,
    fontWeight: "900",
  },
});