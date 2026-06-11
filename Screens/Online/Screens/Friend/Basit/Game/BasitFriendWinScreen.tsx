import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useNavigation } from "@react-navigation/native";
import { useLanguage } from "../../../../../language/LanguageContext";

export default function BasitFriendWinScreen() {
  const navigation = useNavigation<any>();
  const { t } = useLanguage();

  const goFriendHome = () => {
    navigation.reset({
      index: 0,
      routes: [{ name: "OnlineTabs", params: { screen: "FirstFriend" } }],
    });
  };

  return (
    <LinearGradient colors={["#070712", "#101035", "#171753"]} style={styles.container}>
      <SafeAreaView style={styles.safe}>
        <View style={styles.glowOne} />
        <View style={styles.glowTwo} />

        <View style={styles.card}>
          <View style={styles.badge}>
            <Text style={styles.emoji}>🏆</Text>
          </View>

          <Text style={styles.title}>{t.youWon}</Text>
          <Text style={styles.text}>{t.friendWonMessage}</Text>

          <TouchableOpacity style={styles.primaryButton} onPress={goFriendHome}>
            <LinearGradient
              colors={["#22C55E", "#16A34A", "#00D2FF"]}
              style={styles.buttonGradient}
            >
              <Text style={styles.buttonText}>{t.backToFriendLeague}</Text>
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={() =>
              navigation.reset({
                index: 0,
                routes: [{ name: "OnlineTabs", params: { screen: "OnlineHome" } }],
              })
            }
          >
            <Text style={styles.secondaryText}>{t.backToHome}</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  safe: { flex: 1, paddingHorizontal: 24, justifyContent: "center" },
  glowOne: {
    position: "absolute",
    width: 270,
    height: 270,
    borderRadius: 135,
    backgroundColor: "rgba(34,197,94,0.28)",
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
  card: {
    borderRadius: 32,
    padding: 22,
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.08)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.16)",
  },
  badge: {
    width: 102,
    height: 102,
    borderRadius: 36,
    backgroundColor: "rgba(34,197,94,0.14)",
    borderWidth: 1,
    borderColor: "rgba(34,197,94,0.35)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 18,
  },
  emoji: { fontSize: 58 },
  title: {
    fontSize: 38,
    color: "#FFFFFF",
    fontWeight: "900",
    marginBottom: 10,
    textAlign: "center",
  },
  text: {
    fontSize: 17,
    color: "#D8D8F0",
    fontWeight: "800",
    textAlign: "center",
    lineHeight: 24,
    marginBottom: 24,
  },
  primaryButton: {
    width: "100%",
    borderRadius: 22,
    overflow: "hidden",
    marginBottom: 13,
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
  secondaryButton: {
    width: "100%",
    paddingVertical: 16,
    borderRadius: 21,
    backgroundColor: "rgba(255,255,255,0.08)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.16)",
    alignItems: "center",
  },
  secondaryText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "900",
  },
});