import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useNavigation } from "@react-navigation/native";
import { MaterialCommunityIcons as Icon } from "@expo/vector-icons";
import { useLanguage } from "../../../../Screens/language/LanguageContext";

export default function FirstCaylak() {
  const navigation = useNavigation<any>();
  const { t } = useLanguage();

  return (
    <LinearGradient colors={["#070712", "#101035", "#171753"]} style={styles.container}>
      <SafeAreaView style={styles.safe}>
        <View style={styles.glowOne} />
        <View style={styles.glowTwo} />

        <View style={styles.header}>
          <Text style={styles.logo}>MEMOLY</Text>
          <Text style={styles.subLogo}>ROOKIE ARENA</Text>
        </View>

        <View style={styles.heroCard}>
          <View style={styles.iconBadge}>
            <Icon name="cards-playing-outline" size={42} color="#38BDF8" />
          </View>

          <Text style={styles.title}>{t.rookieLeagueTitle}</Text>
          <Text style={styles.subtitle}>{t.rookieLeagueWelcome}</Text>

          <View style={styles.infoBox}>
            <Text style={styles.infoText}>• {t.rookieInfo1}</Text>
            <Text style={styles.infoText}>• {t.rookieInfo2}</Text>
            <Text style={styles.infoText}>• {t.rookieInfo3}</Text>
          </View>

          <View style={styles.statsRow}>
            <View style={styles.statBox}>
              <Icon name="hand-coin" size={24} color="#FACC15" />
              <Text style={styles.statLabel}>{t.entryFeeText}</Text>
              <Text style={styles.statValue}>100</Text>
            </View>

            <View style={styles.statBox}>
              <Icon name="trophy" size={24} color="#22C55E" />
              <Text style={styles.statLabel}>{t.rewardText}</Text>
              <Text style={styles.statValue}>200</Text>
            </View>
          </View>
        </View>

        <TouchableOpacity
          style={styles.playButton}
          onPress={() => navigation.navigate("CaylakLigi")}
          activeOpacity={0.9}
        >
          <LinearGradient
            colors={["#8E7CFF", "#6C5CE7", "#00D2FF"]}
            style={styles.playGradient}
          >
            <Icon name="play" size={25} color="#FFFFFF" />
            <Text style={styles.playText}>{t.play}</Text>
          </LinearGradient>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.backButton}
          onPress={() =>
            navigation.navigate("OnlineTabs", {
              screen: "OnlineHome",
            })
          }
          activeOpacity={0.85}
        >
          <Icon name="home-outline" size={22} color="#00D2FF" />
          <Text style={styles.backText}>{t.backToHome || "Ana Sayfaya Dön"}</Text>
          <Text style={styles.arrow}>›</Text>
        </TouchableOpacity>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },

  safe: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 28,
    paddingBottom: 28,
    justifyContent: "center",
  },

  glowOne: {
    position: "absolute",
    width: 280,
    height: 280,
    borderRadius: 140,
    backgroundColor: "rgba(108,92,231,0.34)",
    top: -100,
    right: -115,
  },

  glowTwo: {
    position: "absolute",
    width: 240,
    height: 240,
    borderRadius: 120,
    backgroundColor: "rgba(0,210,255,0.18)",
    bottom: 100,
    left: -115,
  },

  header: {
    alignItems: "center",
    marginBottom: 22,
  },

  logo: {
    color: "#FFFFFF",
    fontSize: 40,
    fontWeight: "900",
    letterSpacing: 3,
  },

  subLogo: {
    marginTop: 5,
    color: "#00D2FF",
    fontSize: 12,
    fontWeight: "900",
    letterSpacing: 2,
  },

  heroCard: {
    borderRadius: 32,
    padding: 20,
    backgroundColor: "rgba(255,255,255,0.08)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.16)",
    alignItems: "center",
    marginBottom: 16,
  },

  iconBadge: {
    width: 88,
    height: 88,
    borderRadius: 30,
    backgroundColor: "rgba(56,189,248,0.13)",
    borderWidth: 1,
    borderColor: "rgba(56,189,248,0.34)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 15,
  },

  title: {
    color: "#FFFFFF",
    fontSize: 31,
    fontWeight: "900",
    textAlign: "center",
  },

  subtitle: {
    marginTop: 8,
    color: "#D8D8F0",
    fontSize: 15,
    fontWeight: "700",
    lineHeight: 21,
    textAlign: "center",
  },

  infoBox: {
    width: "100%",
    marginTop: 18,
    padding: 15,
    borderRadius: 22,
    backgroundColor: "rgba(255,255,255,0.07)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.14)",
  },

  infoText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "800",
    lineHeight: 22,
  },

  statsRow: {
    width: "100%",
    flexDirection: "row",
    gap: 10,
    marginTop: 15,
  },

  statBox: {
    flex: 1,
    height: 84,
    borderRadius: 22,
    backgroundColor: "rgba(0,210,255,0.10)",
    borderWidth: 1,
    borderColor: "rgba(0,210,255,0.25)",
    alignItems: "center",
    justifyContent: "center",
  },

  statLabel: {
    marginTop: 5,
    color: "#AFAFD1",
    fontSize: 10,
    fontWeight: "900",
    textAlign: "center",
  },

  statValue: {
    marginTop: 2,
    color: "#FFFFFF",
    fontSize: 21,
    fontWeight: "900",
  },

  playButton: {
    width: "100%",
    borderRadius: 24,
    overflow: "hidden",
    marginBottom: 13,
    shadowColor: "#00D2FF",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.28,
    shadowRadius: 18,
    elevation: 10,
  },

  playGradient: {
    minHeight: 62,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },

  playText: {
    color: "#FFFFFF",
    fontSize: 19,
    fontWeight: "900",
  },

  backButton: {
    minHeight: 60,
    borderRadius: 22,
    backgroundColor: "rgba(255,255,255,0.08)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.16)",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 15,
  },

  backText: {
    flex: 1,
    marginLeft: 10,
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "900",
  },

  arrow: {
    color: "#00D2FF",
    fontSize: 30,
    fontWeight: "700",
  },
});