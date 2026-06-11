import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useNavigation } from "@react-navigation/native";
import { useLanguage } from "../language/LanguageContext";

export default function OfflineModesScreen() {
  const navigation = useNavigation<any>();
  const { t } = useLanguage();

  return (
    <LinearGradient colors={["#070712", "#101035", "#171753"]} style={styles.container}>
      <View style={styles.glowOne} />
      <View style={styles.glowTwo} />

      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.navigate("HomeScreen")}
          activeOpacity={0.85}
        >
          <Text style={styles.backText}>‹</Text>
        </TouchableOpacity>

        <Text style={styles.logo}>MEMOLY</Text>
        <Text style={styles.subLogo}>OFFLINE ZONE</Text>
      </View>

      <View style={styles.content}>
        <Text style={styles.title}>{t.offlineModesTitle}</Text>
        <Text style={styles.description}>{t.offlineModesDescription}</Text>

        <TouchableOpacity
          style={styles.modeCard}
          onPress={() => navigation.navigate("LocalMultiplayerScreen")}
          activeOpacity={0.9}
        >
          <LinearGradient
            colors={["#8E7CFF", "#6C5CE7", "#00D2FF"]}
            style={styles.cardGradient}
          >
            <View style={styles.iconBox}>
              <Text style={styles.icon}>⚔️</Text>
            </View>

            <View style={styles.cardTextArea}>
              <Text style={styles.cardTitle}>{t.localMultiplayer}</Text>
              <Text style={styles.cardDesc}>Aynı cihazda arkadaşınla hafıza düellosu yap.</Text>
            </View>

            <Text style={styles.arrow}>›</Text>
          </LinearGradient>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.secondaryCard}
          onPress={() => navigation.navigate("ExerciseFirst")}
          activeOpacity={0.9}
        >
          <View style={styles.iconBoxDark}>
            <Text style={styles.icon}>🧠</Text>
          </View>

          <View style={styles.cardTextArea}>
            <Text style={styles.secondaryTitle}>{t.exercise}</Text>
            <Text style={styles.secondaryDesc}>Egzersizlerle odaklanmanı ve hafızanı güçlendir.</Text>
          </View>

          <Text style={styles.arrowLight}>›</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.bottomInfo}>
        <Text style={styles.bottomText}>⚡ İnternetsiz, hızlı ve eğlenceli oyun deneyimi</Text>
      </View>
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
    top: -80,
    right: -90,
  },

  glowTwo: {
    position: "absolute",
    width: 230,
    height: 230,
    borderRadius: 115,
    backgroundColor: "rgba(0, 210, 255, 0.18)",
    bottom: 80,
    left: -100,
  },

  header: {
    alignItems: "center",
  },

  backButton: {
    position: "absolute",
    left: 0,
    top: 0,
    width: 42,
    height: 42,
    borderRadius: 16,
    backgroundColor: "rgba(255,255,255,0.08)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.14)",
    alignItems: "center",
    justifyContent: "center",
  },

  backText: {
    color: "#FFFFFF",
    fontSize: 34,
    fontWeight: "700",
    marginTop: -3,
  },

  logo: {
    fontSize: 38,
    fontWeight: "900",
    color: "#FFFFFF",
    letterSpacing: 3,
  },

  subLogo: {
    marginTop: 5,
    color: "#00D2FF",
    fontSize: 12,
    fontWeight: "900",
    letterSpacing: 2,
  },

  content: {
    flex: 1,
    justifyContent: "center",
  },

  title: {
    fontSize: 30,
    fontWeight: "900",
    color: "#FFFFFF",
    textAlign: "center",
    marginBottom: 10,
  },

  description: {
    fontSize: 15,
    color: "#D8D8F0",
    textAlign: "center",
    lineHeight: 22,
    marginBottom: 34,
  },

  modeCard: {
    width: "100%",
    borderRadius: 26,
    overflow: "hidden",
    marginBottom: 16,
    shadowColor: "#00D2FF",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.28,
    shadowRadius: 18,
    elevation: 10,
  },

  cardGradient: {
    minHeight: 112,
    padding: 18,
    borderRadius: 26,
    flexDirection: "row",
    alignItems: "center",
  },

  secondaryCard: {
    minHeight: 112,
    padding: 18,
    borderRadius: 26,
    backgroundColor: "rgba(255,255,255,0.08)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.16)",
    flexDirection: "row",
    alignItems: "center",
  },

  iconBox: {
    width: 58,
    height: 58,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.20)",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 14,
  },

  iconBoxDark: {
    width: 58,
    height: 58,
    borderRadius: 20,
    backgroundColor: "rgba(0,210,255,0.12)",
    borderWidth: 1,
    borderColor: "rgba(0,210,255,0.22)",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 14,
  },

  icon: {
    fontSize: 28,
  },

  cardTextArea: {
    flex: 1,
  },

  cardTitle: {
    color: "#FFFFFF",
    fontSize: 19,
    fontWeight: "900",
  },

  cardDesc: {
    marginTop: 5,
    color: "#F2F2FF",
    fontSize: 13,
    fontWeight: "700",
    lineHeight: 18,
  },

  secondaryTitle: {
    color: "#FFFFFF",
    fontSize: 19,
    fontWeight: "900",
  },

  secondaryDesc: {
    marginTop: 5,
    color: "#CFCFE6",
    fontSize: 13,
    fontWeight: "700",
    lineHeight: 18,
  },

  arrow: {
    color: "#FFFFFF",
    fontSize: 36,
    fontWeight: "600",
    marginLeft: 8,
  },

  arrowLight: {
    color: "#00D2FF",
    fontSize: 36,
    fontWeight: "600",
    marginLeft: 8,
  },

  bottomInfo: {
    alignItems: "center",
  },

  bottomText: {
    color: "#AFAFD1",
    fontSize: 13,
    fontWeight: "800",
    textAlign: "center",
  },
});