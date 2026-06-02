import React, { useEffect, useRef, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { getAuth } from "firebase/auth";
import { ref, runTransaction, get } from "firebase/database";
import { doc, updateDoc, increment } from "firebase/firestore";
import { db, firestore } from "../../../../../firebaseConfig";

export default function ZihinFinalWinScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const { roomId, roomPath = "zihinFinalRooms" } = route.params;

  const claimedRef = useRef(false);
  const [reward, setReward] = useState(50000);

  useEffect(() => {
    const giveReward = async () => {
      const user = getAuth().currentUser;
      if (!user || claimedRef.current) return;

      claimedRef.current = true;

      const roomSnap = await get(ref(db, `${roomPath}/${roomId}`));
      const roomReward = roomSnap.val()?.reward ?? 50000;
      setReward(roomReward);

      const awardRef = ref(db, `${roomPath}/${roomId}/awardClaimed`);

      const tx = await runTransaction(awardRef, (current) => {
        if (current) return current;
        return {
          uid: user.uid,
          claimedAt: Date.now(),
        };
      });

      if (tx.committed) {
        await updateDoc(doc(firestore, "users", user.uid), {
          coins: increment(roomReward),
          onlinePoints: increment(1000),
        });
      }
    };

    giveReward();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.emoji}>🧠👑</Text>
      <Text style={styles.title}>Final Kazananı!</Text>
      <Text style={styles.text}>+{reward} Coin</Text>
      <Text style={styles.text}>+1000 Online Puan</Text>

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
    fontSize: 86,
    marginBottom: 16,
  },
  title: {
    fontSize: 38,
    color: "#facc15",
    fontWeight: "900",
    marginBottom: 18,
    textAlign: "center",
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