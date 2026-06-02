import React, { useEffect, useRef, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { getAuth } from "firebase/auth";
import { doc, increment, updateDoc } from "firebase/firestore";
import { ref, runTransaction, get } from "firebase/database";
import { firestore, db } from "../../../../../firebaseConfig";

export default function ZihinFinalDrawScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const { roomId, roomPath = "zihinFinalRooms" } = route.params;

  const rewardedRef = useRef(false);
  const [reward, setReward] = useState(10000);

  useEffect(() => {
    const giveDrawReward = async () => {
      const user = getAuth().currentUser;
      if (!user || rewardedRef.current) return;

      rewardedRef.current = true;

      try {
        const roomSnap = await get(ref(db, `${roomPath}/${roomId}`));
        const drawReward = roomSnap.val()?.drawReward ?? 10000;
        setReward(drawReward);

        const rewardRef = ref(db, `${roomPath}/${roomId}/drawRewards/${user.uid}`);

        const tx = await runTransaction(rewardRef, (current) => {
          if (current) return current;

          return {
            claimed: true,
            claimedAt: Date.now(),
          };
        });

        if (tx.committed) {
          await updateDoc(doc(firestore, "users", user.uid), {
            coins: increment(drawReward),
          });
        }
      } catch (error) {
        console.log("Zihin final beraberlik ödül hatası:", error);
      }
    };

    giveDrawReward();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.emoji}>🧠🤝</Text>
      <Text style={styles.title}>Final Berabere!</Text>
      <Text style={styles.text}>İki oyuncu da aynı sayıda eş buldu.</Text>
      <Text style={styles.rewardText}>+{reward} Coin</Text>

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
    fontSize: 85,
    marginBottom: 16,
  },
  title: {
    fontSize: 40,
    color: "#facc15",
    fontWeight: "900",
    marginBottom: 18,
    textAlign: "center",
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