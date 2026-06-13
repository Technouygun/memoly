import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useNavigation } from "@react-navigation/native";
import { useLanguage } from "../../../../language/LanguageContext";

type RobotMood = "happy" | "sad" | "draw";

function RobotFace({ mood }: { mood: RobotMood }) {
  const isHappy = mood === "happy";
  const isSad = mood === "sad";
  const isDraw = mood === "draw";

  return (
    <View style={isDraw ? styles.robotDrawShell : styles.robotShell}>
      <View
        style={[
          styles.robotHead,
          isSad && styles.robotHeadSad,
          isDraw && styles.robotHeadDraw,
        ]}
      >
        <View style={[styles.antenna, isSad && styles.antennaSad, isDraw && styles.antennaDraw]} />

        <View style={styles.eyeRow}>
          <View
            style={[
              styles.robotEye,
              isSad && styles.robotEyeSad,
              isDraw && styles.robotEyeDraw,
            ]}
          />
          <View
            style={[
              styles.robotEye,
              isSad && styles.robotEyeSad,
              isDraw && styles.robotEyeDraw,
            ]}
          />
        </View>

        {isHappy && <View style={[styles.robotMouth, styles.robotMouthHappy]} />}
        {isSad && <View style={[styles.robotMouth, styles.robotMouthSad]} />}
        {isDraw && <View style={styles.robotMouthFlat} />}
      </View>
    </View>
  );
}

export default function HafizaWinScreen() {
  const navigation = useNavigation<any>();
  const { t } = useLanguage();

  const goOnlineHome = () => {
    navigation.reset({
      index: 0,
      routes: [{ name: "OnlineTabs", params: { screen: "OnlineHome" } }],
    });
  };

  return (
    <LinearGradient colors={["#070712", "#101035", "#171753"]} style={styles.container}>
      <SafeAreaView style={styles.safe}>
        <View style={styles.glowOne} />
        <View style={styles.glowTwo} />

        <View style={styles.card}>
          <RobotFace mood="happy" />

          <Text style={styles.title}>{t.youWon}</Text>
          <Text style={styles.subtitle}>{t.memoryLeagueMatchCompleted}</Text>

          <View style={styles.rewardBox}>
            <Text style={styles.rewardLabel}>Coin Ödülü</Text>
            <Text style={styles.rewardValue}>+7500</Text>
          </View>

          <TouchableOpacity style={styles.primaryButton} onPress={goOnlineHome}>
            <LinearGradient
              colors={["#C084FC", "#8E7CFF", "#00D2FF"]}
              style={styles.buttonGradient}
            >
              <Text style={styles.buttonText}>{t.homePage}</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  robotShell: {
  width: 124,
  height: 124,
  borderRadius: 40,
  backgroundColor: "rgba(0,210,255,0.10)",
  borderWidth: 1,
  borderColor: "rgba(0,210,255,0.38)",
  alignItems: "center",
  justifyContent: "center",
  marginBottom: 18,
},

robotDrawShell: {
  width: 124,
  height: 124,
  borderRadius: 40,
  backgroundColor: "rgba(250,204,21,0.10)",
  borderWidth: 1,
  borderColor: "rgba(250,204,21,0.38)",
  alignItems: "center",
  justifyContent: "center",
  marginBottom: 18,
},

robotHead: {
  width: 82,
  height: 82,
  borderRadius: 26,
  backgroundColor: "rgba(255,255,255,0.10)",
  borderWidth: 1.5,
  borderColor: "#00D2FF",
  alignItems: "center",
  justifyContent: "center",
},

robotHeadSad: {
  borderColor: "#FCA5A5",
  backgroundColor: "rgba(239,68,68,0.12)",
},

robotHeadDraw: {
  borderColor: "#FDE68A",
  backgroundColor: "rgba(250,204,21,0.10)",
},

antenna: {
  position: "absolute",
  top: -12,
  width: 24,
  height: 8,
  borderRadius: 999,
  backgroundColor: "#00D2FF",
},

antennaSad: {
  backgroundColor: "#FCA5A5",
},

antennaDraw: {
  backgroundColor: "#FDE68A",
},

eyeRow: {
  flexDirection: "row",
  gap: 14,
  marginBottom: 13,
},

robotEye: {
  width: 12,
  height: 12,
  borderRadius: 6,
  backgroundColor: "#86EFAC",
  shadowColor: "#86EFAC",
  shadowOpacity: 0.8,
  shadowRadius: 8,
  elevation: 8,
},

robotEyeSad: {
  backgroundColor: "#FCA5A5",
},

robotEyeDraw: {
  backgroundColor: "#FDE68A",
},

robotMouth: {
  width: 36,
  height: 14,
  borderColor: "#FFFFFF",
},

robotMouthHappy: {
  borderBottomWidth: 3,
  borderRadius: 20,
},

robotMouthSad: {
  borderTopWidth: 3,
  borderRadius: 20,
},

robotMouthFlat: {
  width: 36,
  height: 3,
  borderRadius: 999,
  backgroundColor: "#FDE68A",
},
  container: { flex: 1 },
  safe: { flex: 1, paddingHorizontal: 24, justifyContent: "center" },

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

  card: {
    borderRadius: 32,
    padding: 22,
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.08)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.16)",
  },

  badge: {
    width: 112,
    height: 112,
    borderRadius: 38,
    backgroundColor: "rgba(192,132,252,0.13)",
    borderWidth: 1,
    borderColor: "rgba(192,132,252,0.38)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 18,
  },

  emoji: { fontSize: 50 },

  title: {
    fontSize: 38,
    color: "#FFFFFF",
    fontWeight: "900",
    textAlign: "center",
  },

  subtitle: {
    marginTop: 8,
    marginBottom: 20,
    color: "#D8D8F0",
    fontSize: 16,
    fontWeight: "800",
    textAlign: "center",
    lineHeight: 23,
  },

  rewardBox: {
    width: "100%",
    minHeight: 76,
    borderRadius: 22,
    backgroundColor: "rgba(192,132,252,0.10)",
    borderWidth: 1,
    borderColor: "rgba(192,132,252,0.30)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 22,
  },

  rewardLabel: {
    color: "#AFAFD1",
    fontSize: 12,
    fontWeight: "900",
  },

  rewardValue: {
    marginTop: 3,
    color: "#FFFFFF",
    fontSize: 26,
    fontWeight: "900",
  },

  primaryButton: {
    width: "100%",
    borderRadius: 22,
    overflow: "hidden",
  },

  buttonGradient: {
    paddingVertical: 17,
    alignItems: "center",
  },

  buttonText: {
    color: "#FFFFFF",
    fontSize: 17,
    fontWeight: "900",
  },
});