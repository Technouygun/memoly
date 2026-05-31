import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  ImageBackground,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import {
  ref,
  get,
  set,
  update,
  remove,
  onValue,
  onDisconnect,
  runTransaction,
} from "firebase/database";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { auth, db, firestore } from "../../../../firebaseConfig";

const ENTRY_FEE = 2500;
const REWARD = 7500;
const DRAW_REWARD = 2500;
const BOARD_SIZE = "6x6";

export default function HafizaLigi() {
  const navigation = useNavigation<any>();
  const user = auth.currentUser;

  const [loading, setLoading] = useState(false);
  const [searching, setSearching] = useState(false);
  const [matchId, setMatchId] = useState<string | null>(null);
  const [statusText, setStatusText] = useState("Eşleşme ara");
  const [timer, setTimer] = useState(15);

  const navigatedRef = useRef(false);
  const countdownRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const matchListListenerRef = useRef<null | (() => void)>(null);
  const matchDetailListenerRef = useRef<null | (() => void)>(null);

  const checkCoin = async () => {
    if (!user) return false;

    const userRef = doc(firestore, "users", user.uid);
    const snap = await getDoc(userRef);
    const coins = snap.data()?.coins ?? 0;

    if (coins < ENTRY_FEE) {
      Alert.alert(
        "Yetersiz Coin",
        `Hafıza ligine girmek için en az ${ENTRY_FEE} Coin gerekli.`
      );
      return false;
    }

    return true;
  };

  const payEntryFeeForBothPlayers = async (uid1: string, uid2: string) => {
    try {
      const user1Ref = doc(firestore, "users", uid1);
      const user2Ref = doc(firestore, "users", uid2);

      const user1Snap = await getDoc(user1Ref);
      const user2Snap = await getDoc(user2Ref);

      const user1Coins = user1Snap.data()?.coins ?? 0;
      const user2Coins = user2Snap.data()?.coins ?? 0;

      if (user1Coins < ENTRY_FEE || user2Coins < ENTRY_FEE) {
        return false;
      }

      await updateDoc(user1Ref, { coins: user1Coins - ENTRY_FEE });
      await updateDoc(user2Ref, { coins: user2Coins - ENTRY_FEE });

      return true;
    } catch (error) {
      console.log("Coin düşme hatası:", error);
      return false;
    }
  };

  const removeMyWaiting = async () => {
    if (!user) return;

    const waitingRef = ref(db, "hafizaMatchmaking/waiting");
    const snap = await get(waitingRef);

    if (snap.exists() && snap.val()?.uid === user.uid) {
      await remove(waitingRef);
    }
  };

  const handleJoin = async () => {
    if (!user) {
      Alert.alert("Giriş Gerekli", "Online oynamak için önce giriş yapmalısın.");
      return;
    }

    const hasCoin = await checkCoin();
    if (!hasCoin) return;

    setLoading(true);
    setSearching(true);
    setStatusText("Eşleşme aranıyor...");

    try {
      const activeRef = ref(db, `activeUsers/${user.uid}`);
      await set(activeRef, {
        uid: user.uid,
        online: true,
        lastSeen: Date.now(),
      });
      onDisconnect(activeRef).remove();

      const waitingRef = ref(db, "hafizaMatchmaking/waiting");
      const waitingSnap = await get(waitingRef);

      if (waitingSnap.exists()) {
        const opponent = waitingSnap.val();

        if (!opponent?.uid || opponent.uid === user.uid) {
          setStatusText("Eşleşme aranıyor...");
          listenForMyMatch();
          return;
        }

        const tx = await runTransaction(waitingRef, (current) => {
          if (current?.uid === opponent.uid) {
            return null;
          }

          return current;
        });

        if (!tx.committed) {
          listenForMyMatch();
          return;
        }

        const id = `hafiza_${opponent.uid.slice(0, 6)}_${user.uid.slice(
          0,
          6
        )}_${Date.now()}`;

        const expiresAt = Date.now() + 15000;

        await set(ref(db, `hafizaMatchmaking/matches/${id}`), {
          status: "matched",
          ownerUid: opponent.uid,
          expiresAt,
          createdAt: Date.now(),
          entryFee: ENTRY_FEE,
          reward: REWARD,
          drawReward: DRAW_REWARD,
          boardSize: BOARD_SIZE,
          players: {
            [opponent.uid]: {
              uid: opponent.uid,
              name: opponent.name ?? "Oyuncu 1",
              ready: false,
            },
            [user.uid]: {
              uid: user.uid,
              name: user.displayName ?? "Oyuncu 2",
              ready: false,
            },
          },
        });

        setMatchId(id);
        setSearching(false);
        setStatusText("Eşleşme bulundu!");
        attachMatchListener(id);
        startCountdown(expiresAt, id);
      } else {
        await set(waitingRef, {
          uid: user.uid,
          name: user.displayName ?? "Oyuncu",
          ts: Date.now(),
        });

        onDisconnect(waitingRef).remove();

        setStatusText("Eşleşme aranıyor...");
        listenForMyMatch();
      }
    } catch (error) {
      console.log("Eşleşme hatası:", error);
      setSearching(false);
      Alert.alert("Hata", "Eşleşme başlatılırken bir sorun oluştu.");
    } finally {
      setLoading(false);
    }
  };

  const listenForMyMatch = () => {
    if (!user) return;
    if (matchListListenerRef.current) return;

    const matchesRef = ref(db, "hafizaMatchmaking/matches");

    matchListListenerRef.current = onValue(matchesRef, (snap) => {
      if (!snap.exists()) return;

      const matches = snap.val();

      for (const id in matches) {
        const match = matches[id];

        if (
          match.status === "matched" &&
          match.players?.[user.uid] &&
          Date.now() < match.expiresAt
        ) {
          setMatchId(id);
          setSearching(false);
          setStatusText("Eşleşme bulundu!");
          attachMatchListener(id);
          startCountdown(match.expiresAt, id);
          break;
        }
      }
    });
  };

  const handleReady = async () => {
    if (!user || !matchId) return;

    await update(
      ref(db, `hafizaMatchmaking/matches/${matchId}/players/${user.uid}`),
      { ready: true }
    );

    setStatusText("Hazır! Rakip bekleniyor...");
  };

  const attachMatchListener = (id: string) => {
    if (matchDetailListenerRef.current) return;

    const matchRef = ref(db, `hafizaMatchmaking/matches/${id}`);

    matchDetailListenerRef.current = onValue(matchRef, async (snap) => {
      if (!snap.exists()) return;

      const data = snap.val();
      const players = data.players ?? {};
      const uids = Object.keys(players);
      const currentUid = auth.currentUser?.uid;

      const allReady =
        uids.length === 2 &&
        Object.values(players).every((player: any) => player.ready === true);

      if (data.status === "matched" && allReady) {
        if (navigatedRef.current) return;

        const isOwner = currentUid === data.ownerUid;

        if (isOwner) {
          const player2Uid = uids.find((uid) => uid !== data.ownerUid);

          if (!player2Uid) return;

          const paymentOk = await payEntryFeeForBothPlayers(
            data.ownerUid,
            player2Uid
          );

          if (!paymentOk) {
            Alert.alert("Hata", "Oyunculardan birinin Coin bakiyesi yetersiz.");
            await remove(matchRef);
            return;
          }

          await set(ref(db, `hafizaRooms/${id}`), {
            league: "hafiza",
            status: "playing",
            entryFee: ENTRY_FEE,
            reward: REWARD,
            drawReward: DRAW_REWARD,
            boardSize: BOARD_SIZE,
            createdAt: Date.now(),
            players: {
              player1: {
                uid: data.ownerUid,
                name: players[data.ownerUid]?.name ?? "Oyuncu 1",
                score: 0,
              },
              player2: {
                uid: player2Uid,
                name: players[player2Uid]?.name ?? "Oyuncu 2",
                score: 0,
              },
            },
          });

          await update(matchRef, { status: "started" });
        }
      }

      if (data.status === "started") {
        if (navigatedRef.current) return;

        navigatedRef.current = true;
        stopCountdown();

        navigation.replace("HafizaGameScreen", {
          roomId: id,
          league: "hafiza",
          boardSize: BOARD_SIZE,
        });
      }
    });
  };

  const startCountdown = (expiresAt: number, id: string) => {
    stopCountdown();

    countdownRef.current = setInterval(async () => {
      const remaining = Math.max(0, Math.ceil((expiresAt - Date.now()) / 1000));
      setTimer(remaining);

      if (remaining <= 0) {
        stopCountdown();

        setMatchId(null);
        setSearching(false);
        setStatusText("Eşleşme ara");
        setTimer(15);

        const currentUid = auth.currentUser?.uid;

        if (currentUid && !navigatedRef.current) {
          await remove(ref(db, `activeUsers/${currentUid}`));
          await removeMyWaiting();

          const matchRef = ref(db, `hafizaMatchmaking/matches/${id}`);
          const snap = await get(matchRef);

          if (snap.exists() && snap.val().ownerUid === currentUid) {
            await remove(matchRef);
          }
        }
      }
    }, 1000);
  };

  const stopCountdown = () => {
    if (countdownRef.current) {
      clearInterval(countdownRef.current);
      countdownRef.current = null;
    }
  };

  const handleBackHome = async () => {
    if (user && !navigatedRef.current) {
      await remove(ref(db, `activeUsers/${user.uid}`));
      await removeMyWaiting();

      if (matchId) {
        const matchRef = ref(db, `hafizaMatchmaking/matches/${matchId}`);
        const snap = await get(matchRef);

        if (snap.exists() && snap.val().ownerUid === user.uid) {
          await remove(matchRef);
        }
      }
    }

    navigation.replace("FirstOnline");
  };

  useEffect(() => {
    return () => {
      stopCountdown();

      if (matchListListenerRef.current) {
        matchListListenerRef.current();
      }

      if (matchDetailListenerRef.current) {
        matchDetailListenerRef.current();
      }

      if (user && !navigatedRef.current) {
        remove(ref(db, `activeUsers/${user.uid}`));
        removeMyWaiting();
      }
    };
  }, []);

  return (
    <ImageBackground
      source={require("../../../../assets/icon.png")}
      style={styles.background}
      resizeMode="cover"
    >
      <View style={styles.overlay}>
        <Text style={styles.title}>HAFIZA LİGİ</Text>
        <Text style={styles.entryText}>Giriş Bedeli: {ENTRY_FEE} Coin</Text>
        <Text style={styles.rewardText}>Kazanan: {REWARD} Coin</Text>
        <Text style={styles.boardText}>Oyun: {BOARD_SIZE}</Text>

        {!matchId ? (
          <View style={styles.card}>
            {loading || searching ? (
              <>
                <ActivityIndicator size="large" color="#7c3aed" />
                <Text style={styles.statusText}>Eşleşme aranıyor...</Text>
              </>
            ) : (
              <>
                <TouchableOpacity style={styles.matchButton} onPress={handleJoin}>
                  <MaterialCommunityIcons
                    name="account-search"
                    size={28}
                    color="#fff"
                  />
                  <Text style={styles.matchButtonText}>Eşleşmeye Başla</Text>
                </TouchableOpacity>

                <Text style={styles.statusText}>{statusText}</Text>
              </>
            )}
          </View>
        ) : (
          <View style={styles.card}>
            <Text style={styles.foundText}>Eşleşme Bulundu!</Text>

            <TouchableOpacity style={styles.readyButton} onPress={handleReady}>
              <MaterialCommunityIcons name="play" size={28} color="#fff" />
              <Text style={styles.readyButtonText}>Oyna</Text>
            </TouchableOpacity>

            <Text style={styles.timerText}>Kalan süre: {timer} sn</Text>
            <Text style={styles.statusText}>{statusText}</Text>
          </View>
        )}

        <TouchableOpacity style={styles.homeButton} onPress={handleBackHome}>
          <MaterialCommunityIcons name="home" size={24} color="#fff" />
          <Text style={styles.homeButtonText}>Ana Sayfa</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    justifyContent: "center",
  },
  overlay: {
    margin: 20,
    padding: 22,
    borderRadius: 28,
    backgroundColor: "rgba(0,0,0,0.58)",
    alignItems: "center",
  },
  title: {
    fontSize: 36,
    fontWeight: "900",
    color: "#c084fc",
    marginBottom: 8,
  },
  entryText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 6,
  },
  rewardText: {
    color: "#facc15",
    fontSize: 17,
    fontWeight: "900",
    marginBottom: 6,
  },
  boardText: {
    color: "#a5f3fc",
    fontSize: 17,
    fontWeight: "900",
    marginBottom: 22,
  },
  card: {
    width: "100%",
    minHeight: 180,
    borderRadius: 24,
    backgroundColor: "rgba(255,255,255,0.92)",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  matchButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "#7c3aed",
    paddingVertical: 15,
    paddingHorizontal: 24,
    borderRadius: 18,
  },
  matchButtonText: {
    color: "#fff",
    fontSize: 19,
    fontWeight: "900",
  },
  statusText: {
    marginTop: 16,
    fontSize: 16,
    color: "#444",
    fontWeight: "700",
    textAlign: "center",
  },
  foundText: {
    fontSize: 24,
    fontWeight: "900",
    color: "#16a34a",
    marginBottom: 18,
  },
  readyButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "#22c55e",
    paddingVertical: 15,
    paddingHorizontal: 34,
    borderRadius: 18,
  },
  readyButtonText: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "900",
  },
  timerText: {
    marginTop: 16,
    fontSize: 18,
    color: "#7c3aed",
    fontWeight: "900",
  },
  homeButton: {
    marginTop: 24,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "#111827",
    paddingVertical: 13,
    paddingHorizontal: 22,
    borderRadius: 16,
  },
  homeButtonText: {
    color: "#fff",
    fontSize: 17,
    fontWeight: "800",
  },
});