import React, { useEffect, useRef } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { getAuth } from "firebase/auth";
import { ref, runTransaction } from "firebase/database";
import { doc, updateDoc, increment } from "firebase/firestore";
import { db, firestore } from "../../../../../firebaseConfig";

export default function ZihinWinScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const { roomId } = route.params;

  const claimedRef = useRef(false);

  useEffect(() => {
    const giveReward = async () => {
      const user = getAuth().currentUser;
      if (!user || claimedRef.current) return;

      claimedRef.current = true;

      const awardRef = ref(db, `zihinRooms/${roomId}/awardClaimed`);

      const tx = await runTransaction(awardRef, (current) => {
        if (current) return current;

        return {
          uid: user.uid,
          claimedAt: Date.now(),
        };
      });

      if (tx.committed) {
       await updateDoc(doc(firestore, "users", user.uid), {
  coins: increment(20000),
  onlinePoints: increment(500),
  zihinFinalTicket: increment(1),
});
      }
    };

    giveReward();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.emoji}>🧠🏆</Text>
      <Text style={styles.title}>Zihin Dehası!</Text>
      <Text style={styles.text}>+20000 Coin</Text>
<Text style={styles.text}>+500 Online Puan</Text>
<Text style={styles.text}>+1 Zihin Final Bileti</Text>

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
    backgroundColor: "#052e16",
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  emoji: {
    fontSize: 80,
    marginBottom: 16,
  },
  title: {
    fontSize: 38,
    color: "#facc15",
    fontWeight: "900",
    marginBottom: 18,
  },
  text: {
    fontSize: 22,
    color: "#fff",
    fontWeight: "800",
    marginBottom: 8,
  },
  button: {
    marginTop: 30,
    backgroundColor: "#22c55e",
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