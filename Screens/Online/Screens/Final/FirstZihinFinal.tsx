import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useNavigation } from "@react-navigation/native";
import { MaterialCommunityIcons as Icon } from "@expo/vector-icons";
import { useLanguage } from "../../../language/LanguageContext";

export default function FirstZihinFinal() {
  const navigation = useNavigation<any>();
  const { t } = useLanguage();

  return (
    <LinearGradient colors={["#070712", "#101035", "#171753"]} style={styles.container}>
      <SafeAreaView style={styles.safe}>
        <View style={styles.glowOne} />
        <View style={styles.glowTwo} />

        <View style={styles.header}>
          <Text style={styles.logo}>MEMOLY</Text>
          <Text style={styles.subLogo}>FINAL ARENA</Text>
        </View>

        <View style={styles.heroCard}>
          <View style={styles.iconBadge}>
            <Icon name="crown" size={46} color="#FACC15" />
          </View>

          <Text style={styles.title}>{t.mindFinalTitle}</Text>
          <Text style={styles.subtitle}>{t.mindFinalWelcome}</Text>

          <View style={styles.infoBox}>
            <Text style={styles.infoText}>• {t.mindFinalInfo1}</Text>
            <Text style={styles.infoText}>• {t.mindFinalInfo2}</Text>
            <Text style={styles.infoText}>• {t.mindFinalInfo3}</Text>
          </View>

          <View style={styles.statsRow}>
            <View style={styles.statBox}>
              <Icon name="ticket-confirmation" size={25} color="#FB923C" />
              <Text style={styles.statLabel}>Giriş</Text>
              <Text style={styles.statValue}>1 Bilet</Text>
            </View>

            <View style={styles.statBox}>
              <Icon name="trophy" size={25} color="#22C55E" />
              <Text style={styles.statLabel}>Kazanan</Text>
              <Text style={styles.statValue}>50000</Text>
            </View>
          </View>

          <Text style={styles.rewardText}>{t.mindFinalBigReward}</Text>
        </View>

        <TouchableOpacity
          style={styles.playButton}
          onPress={() => navigation.navigate("ZihinFinalLigi")}
          activeOpacity={0.9}
        >
          <LinearGradient
            colors={["#FACC15", "#FB923C", "#8E7CFF"]}
            style={styles.playGradient}
          >
            <Icon name="ticket-confirmation" size={25} color="#FFFFFF" />
            <Text style={styles.playText}>{t.enterFinal}</Text>
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
    backgroundColor: "rgba(250,204,21,0.24)",
    top: -105,
    right: -120,
  },

  glowTwo: {
    position: "absolute",
    width: 250,
    height: 250,
    borderRadius: 125,
    backgroundColor: "rgba(108,92,231,0.28)",
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
    color: "#FACC15",
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
    backgroundColor: "rgba(250,204,21,0.13)",
    borderWidth: 1,
    borderColor: "rgba(250,204,21,0.36)",
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
    backgroundColor: "rgba(250,204,21,0.10)",
    borderWidth: 1,
    borderColor: "rgba(250,204,21,0.25)",
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
    fontSize: 18,
    fontWeight: "900",
  },

  rewardText: {
    marginTop: 15,
    color: "#86EFAC",
    fontSize: 17,
    fontWeight: "900",
    textAlign: "center",
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