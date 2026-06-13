import React, { useEffect, useRef } from "react";
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useNavigation, useRoute } from "@react-navigation/native";
import { getAuth } from "firebase/auth";
import { doc, increment, updateDoc } from "firebase/firestore";
import { ref, runTransaction } from "firebase/database";
import { firestore, db } from "../../../../../firebaseConfig";
import { useLanguage } from "../../../../language/LanguageContext";


type RobotMood = "happy" | "sad" | "draw";

function RobotFace({ mood }: { mood: RobotMood }) {
  const isHappy = mood === "happy";
  const isSad = mood === "sad";
  const isDraw = mood === "draw";

  return (
    <View
      style={
        isDraw
          ? styles.robotDrawShell
          : styles.robotShell
      }
    >
      <View style={[styles.robotHead, isSad && styles.robotHeadSad]}>
        <View style={styles.antenna} />

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

        {isHappy && (
          <View style={[styles.robotMouth, styles.robotMouthHappy]} />
        )}

        {isSad && (
          <View style={[styles.robotMouth, styles.robotMouthSad]} />
        )}

        {isDraw && <View style={styles.robotMouthFlat} />}
      </View>
    </View>
  );
}
export default function CaylakDrawScreen() {
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
        const rewardRef = ref(db, `caylakRooms/${roomId}/drawRewards/${user.uid}`);

        const tx = await runTransaction(rewardRef, (current) => {
          if (current) return current;

          return {
            claimed: true,
            claimedAt: Date.now(),
          };
        });

        if (tx.committed) {
          await updateDoc(doc(firestore, "users", user.uid), {
            coins: increment(100),
          });
        }
      } catch (error) {
        console.log("Beraberlik ödül hatası:", error);
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
         <RobotFace mood="draw" />

          <Text style={styles.title}>{t.draw}</Text>
          <Text style={styles.text}>{t.drawMessage}</Text>

          <View style={styles.rewardBox}>
            <Text style={styles.rewardLabel}>BERABERLİK ÖDÜLÜ</Text>
            <Text style={styles.rewardValue}>+100 Coin</Text>
          </View>

          <TouchableOpacity style={styles.primaryButton} onPress={goOnlineHome}>
            <LinearGradient
              colors={["#FACC15", "#8E7CFF", "#00D2FF"]}
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
  robotEyeDraw: {
  backgroundColor: "#FDE68A",
},

robotMouthFlat: {
  width: 34,
  height: 3,
  borderRadius: 999,
  backgroundColor: "#FDE68A",
},
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
  width: 78,
  height: 78,
  borderRadius: 24,
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

antenna: {
  position: "absolute",
  top: -12,
  width: 22,
  height: 8,
  borderRadius: 999,
  backgroundColor: "#00D2FF",
},

eyeRow: {
  flexDirection: "row",
  gap: 13,
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

robotMouth: {
  width: 34,
  height: 14,
  borderBottomWidth: 3,
  borderColor: "#FFFFFF",
},

robotMouthHappy: {
  borderRadius: 20,
},

robotMouthSad: {
  borderBottomWidth: 0,
  borderTopWidth: 3,
  borderRadius: 20,
},


  container: { flex: 1 },
  safe: { flex: 1, paddingHorizontal: 24, justifyContent: "center" },

  glowOne: {
    position: "absolute",
    width: 290,
    height: 290,
    borderRadius: 145,
    backgroundColor: "rgba(250,204,21,0.23)",
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
    borderRadius: 34,
    padding: 22,
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.08)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.16)",
  },

  resultMark: {
    width: 112,
    height: 112,
    borderRadius: 38,
    backgroundColor: "rgba(250,204,21,0.13)",
    borderWidth: 1,
    borderColor: "rgba(250,204,21,0.40)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 18,
  },

  innerMark: {
    width: 78,
    height: 78,
    borderRadius: 28,
    backgroundColor: "rgba(250,204,21,0.18)",
    borderWidth: 1,
    borderColor: "#FDE68A",
    alignItems: "center",
    justifyContent: "center",
  },

  markText: {
    color: "#FDE68A",
    fontSize: 17,
    fontWeight: "900",
    letterSpacing: 1.5,
  },

  title: {
    color: "#FFFFFF",
    fontSize: 38,
    fontWeight: "900",
    textAlign: "center",
    marginBottom: 12,
  },

  text: {
    color: "#D8D8F0",
    fontSize: 17,
    fontWeight: "800",
    textAlign: "center",
    lineHeight: 24,
    marginBottom: 18,
  },

  rewardBox: {
    width: "100%",
    minHeight: 72,
    borderRadius: 22,
    backgroundColor: "rgba(250,204,21,0.10)",
    borderWidth: 1,
    borderColor: "rgba(250,204,21,0.30)",
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