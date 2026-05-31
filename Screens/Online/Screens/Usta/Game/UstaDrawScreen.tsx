import React, { useEffect, useRef } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { getAuth } from "firebase/auth";
import { doc, increment, updateDoc } from "firebase/firestore";
import { ref, runTransaction } from "firebase/database";
import { firestore, db } from "../../../../../firebaseConfig";

export default function UstaDrawScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const { roomId } = route.params;

  const rewardedRef = useRef(false);

  useEffect(() => {
    const giveDrawReward = async () => {
      const user = getAuth().currentUser;

      if (!user) return;
      if (rewardedRef.current) return;

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

  return (
    <View style={styles.container}>
      <Text style={styles.emoji}>🤝</Text>

      <Text style={styles.title}>Berabere!</Text>

      <Text style={styles.text}>İki oyuncu da aynı sayıda eş buldu.</Text>

      <Text style={styles.rewardText}>+500 Coin</Text>

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.replace("FirstOnline")}
      >
        <Text style={styles.buttonText}>Online Menüye Dön</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1e1b4b",
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  emoji: {
    fontSize: 90,
    marginBottom: 16,
  },
  title: {
    fontSize: 42,
    color: "#facc15",
    fontWeight: "900",
    marginBottom: 18,
  },
  text: {
    fontSize: 20,
    color: "#fff",
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 14,
  },
  rewardText: {
    fontSize: 30,
    color: "#22c55e",
    fontWeight: "900",
    marginBottom: 26,
  },
  button: {
    marginTop: 10,
    backgroundColor: "#6366f1",
    paddingVertical: 15,
    paddingHorizontal: 28,
    borderRadius: 18,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "900",
  },
});