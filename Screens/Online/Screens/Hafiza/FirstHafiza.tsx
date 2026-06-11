import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { MaterialCommunityIcons as Icon } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useLanguage } from "../../../language/LanguageContext";

export default function FirstHafiza() {
  const navigation = useNavigation<any>();
  const { t } = useLanguage();

  return (
    <LinearGradient colors={["#070712", "#101035", "#171753"]} style={styles.container}>
      <SafeAreaView style={styles.safe}>
        <View style={styles.glowOne} />
        <View style={styles.glowTwo} />

        <View style={styles.header}>
          <Text style={styles.logo}>MEMOLY</Text>
          <Text style={styles.subLogo}>MEMORY MASTER</Text>
        </View>

        <View style={styles.heroCard}>
          <View style={styles.iconBadge}>
            <Icon name="diamond-stone" size={46} color="#C084FC" />
          </View>

          <Text style={styles.title}>{t.memoryLeagueTitle}</Text>
          <Text style={styles.subtitle}>{t.memoryLeagueSubtitle}</Text>

          <View style={styles.infoBox}>
            <Text style={styles.infoText}>• {t.gameMode}: 6x6</Text>
            <Text style={styles.infoText}>• {t.entryFee}: 2500 Coin</Text>
            <Text style={styles.infoText}>• {t.winner}: 7500 Coin</Text>
            <Text style={styles.infoText}>• Berabere: 2500 Coin</Text>
          </View>

          <View style={styles.statsRow}>
            <View style={styles.statBox}>
              <Icon name="hand-coin" size={25} color="#FACC15" />
              <Text style={styles.statLabel}>{t.entryFee}</Text>
              <Text style={styles.statValue}>2500</Text>
            </View>

            <View style={styles.statBox}>
              <Icon name="trophy" size={25} color="#22C55E" />
              <Text style={styles.statLabel}>{t.winner}</Text>
              <Text style={styles.statValue}>7500</Text>
            </View>
          </View>
        </View>

        <TouchableOpacity
          style={styles.playButton}
          onPress={() => navigation.navigate("HafizaLigi")}
          activeOpacity={0.9}
        >
          <LinearGradient
            colors={["#C084FC", "#8E7CFF", "#00D2FF"]}
            style={styles.playGradient}
          >
            <Icon name="play" size={25} color="#FFFFFF" />
            <Text style={styles.playText}>{t.joinLeague}</Text>
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
    width: 290,
    height: 290,
    borderRadius: 145,
    backgroundColor: "rgba(192,132,252,0.28)",
    top: -105,
    right: -120,
  },

  glowTwo: {
    position: "absolute",
    width: 250,
    height: 250,
    borderRadius: 125,
    backgroundColor: "rgba(0,210,255,0.18)",
    bottom: 90,
    left: -120,
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
    color: "#C084FC",
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
    width: 92,
    height: 92,
    borderRadius: 32,
    backgroundColor: "rgba(192,132,252,0.13)",
    borderWidth: 1,
    borderColor: "rgba(192,132,252,0.36)",
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
    height: 86,
    borderRadius: 22,
    backgroundColor: "rgba(192,132,252,0.10)",
    borderWidth: 1,
    borderColor: "rgba(192,132,252,0.25)",
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
    fontSize: 19,
    fontWeight: "900",
  },

  playButton: {
    width: "100%",
    borderRadius: 24,
    overflow: "hidden",
    marginBottom: 13,
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