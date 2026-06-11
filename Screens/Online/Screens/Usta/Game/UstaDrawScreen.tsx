import React, { useEffect, useRef } from "react";
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useNavigation, useRoute } from "@react-navigation/native";
import { getAuth } from "firebase/auth";
import { doc, increment, updateDoc } from "firebase/firestore";
import { ref, runTransaction } from "firebase/database";
import { firestore, db } from "../../../../../firebaseConfig";
import { useLanguage } from "../../../../language/LanguageContext";

export default function UstaDrawScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const { roomId } = route.params;
  const { t } = useLanguage();

  const rewardedRef = useRef(false);

  useEffect(() => {
    const giveDrawReward = async () => {
      const user = getAuth().currentUser;
      if (!user || rewardedRef.current) return;

      rewardedRef.current = true;

      try {
        const rewardRef = ref(db, `ustaRooms/${roomId}/drawRewards/${user.uid}`);

        const tx = await runTransaction(rewardRef, (current) => {
          if (current) return current;

          return {
            claimed: true,
            claimedAt: Date.now(),
          };
        });

        if (tx.committed) {
          await updateDoc(doc(firestore, "users", user.uid), {
            coins: increment(500),
          });
        }
      } catch (error) {
        console.log("Usta beraberlik ödül hatası:", error);
      }
    };

    giveDrawReward();
  }, []);

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
          <View style={styles.badge}>
            <Text style={styles.emoji}>🤝</Text>
          </View>

          <Text style={styles.title}>{t.draw}</Text>
          <Text style={styles.text}>{t.cardMasterDrawMessage}</Text>

          <View style={styles.rewardBox}>
            <Text style={styles.rewardLabel}>Beraberlik Ödülü</Text>
            <Text style={styles.rewardValue}>+500 Coin</Text>
          </View>

          <TouchableOpacity style={styles.primaryButton} onPress={goOnlineHome}>
            <LinearGradient
              colors={["#8E7CFF", "#6C5CE7", "#00D2FF"]}
              style={styles.buttonGradient}
            >
              <Text style={styles.buttonText}>{t.onlineMenu}</Text>
            </LinearGradient>
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
    width: 290,
    height: 290,
    borderRadius: 145,
    backgroundColor: "rgba(142,124,255,0.26)",
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
    backgroundColor: "rgba(0,210,255,0.12)",
    borderWidth: 1,
    borderColor: "rgba(0,210,255,0.35)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 18,
  },

  emoji: { fontSize: 58 },

  title: {
    fontSize: 38,
    color: "#FFFFFF",
    fontWeight: "900",
    textAlign: "center",
    marginBottom: 12,
  },

  text: {
    fontSize: 17,
    color: "#D8D8F0",
    fontWeight: "800",
    textAlign: "center",
    lineHeight: 24,
    marginBottom: 18,
  },

  rewardBox: {
    width: "100%",
    minHeight: 72,
    borderRadius: 22,
    backgroundColor: "rgba(0,210,255,0.10)",
    borderWidth: 1,
    borderColor: "rgba(0,210,255,0.30)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },

  rewardLabel: {
    color: "#AFAFD1",
    fontSize: 12,
    fontWeight: "900",
  },

  rewardValue: {
    marginTop: 3,
    color: "#FFFFFF",
    fontSize: 24,
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