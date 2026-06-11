import React, { useEffect, useRef } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { getAuth } from "firebase/auth";
import { ref, runTransaction } from "firebase/database";
import { doc, updateDoc, increment } from "firebase/firestore";
import { db, firestore } from "../../../../../firebaseConfig";
import { useLanguage } from "../../../../language/LanguageContext";

export default function CaylakWinScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const { roomId } = route.params;
const { t } = useLanguage();
  const claimedRef = useRef(false);

  useEffect(() => {
    const giveReward = async () => {
      const user = getAuth().currentUser;
      if (!user || claimedRef.current) return;

      claimedRef.current = true;

      const awardRef = ref(db, `caylakRooms/${roomId}/awardClaimed`);

      const tx = await runTransaction(awardRef, (current) => {
        if (current) return current;

        return {
          uid: user.uid,
          claimedAt: Date.now(),
        };
      });

      if (tx.committed) {
        await updateDoc(doc(firestore, "users", user.uid), {
          coins: increment(200),
          onlinePoints: increment(50),
        });
      }
    };

    giveReward();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.emoji}>🏆</Text>
      <Text style={styles.title}>{t.youWon}</Text>

      <Text style={styles.text}>+200 Coin</Text>
      <Text style={styles.text}>+50 {t.onlinePoint}</Text>

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.replace("OnlineTabs")}
      >
        <Text style={styles.buttonText}>{t.onlineMenu}</Text>
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