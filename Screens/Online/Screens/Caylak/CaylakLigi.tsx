import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  SafeAreaView,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { MaterialCommunityIcons as Icon } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
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
import { useLanguage } from "../../../../Screens/language/LanguageContext";

const ENTRY_FEE = 100;
const REWARD = 200;

export default function CaylakLigi() {
  const navigation = useNavigation<any>();
  const { t } = useLanguage();
  const user = auth.currentUser;

  const [loading, setLoading] = useState(false);
  const [searching, setSearching] = useState(false);
  const [matchId, setMatchId] = useState<string | null>(null);
  const [statusText, setStatusText] = useState(t.searchMatch);
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
        t.notEnoughCoinsTitle,
        `${t.rookieLeagueTitle} ${t.entryFeeText.toLowerCase()}: ${ENTRY_FEE} Coin`
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

      if (user1Coins < ENTRY_FEE || user2Coins < ENTRY_FEE) return false;

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

    const waitingRef = ref(db, "caylakMatchmaking/waiting");
    const snap = await get(waitingRef);

    if (snap.exists() && snap.val()?.uid === user.uid) {
      await remove(waitingRef);
    }
  };

  const handleJoin = async () => {
    if (!user) {
      Alert.alert(t.loginRequired, t.loginRequiredMessage);
      return;
    }

    const hasCoin = await checkCoin();
    if (!hasCoin) return;

    setLoading(true);
    setSearching(true);
    setStatusText(t.searchingMatch);

    try {
      const activeRef = ref(db, `activeUsers/${user.uid}`);

      await set(activeRef, {
        uid: user.uid,
        online: true,
        lastSeen: Date.now(),
      });

      onDisconnect(activeRef).remove();

      const waitingRef = ref(db, "caylakMatchmaking/waiting");
      const waitingSnap = await get(waitingRef);

      if (waitingSnap.exists()) {
        const opponent = waitingSnap.val();

        if (!opponent?.uid || opponent.uid === user.uid) {
          setStatusText("Eşleşme aranıyor...");
          listenForMyMatch();
          return;
        }

        const tx = await runTransaction(waitingRef, (current) => {
          if (current?.uid === opponent.uid) return null;
          return current;
        });

        if (!tx.committed) {
          listenForMyMatch();
          return;
        }

        const id = `caylak_${opponent.uid.slice(0, 6)}_${user.uid.slice(0, 6)}_${Date.now()}`;
        const expiresAt = Date.now() + 15000;

        await set(ref(db, `caylakMatchmaking/matches/${id}`), {
          status: "matched",
          ownerUid: opponent.uid,
          expiresAt,
          createdAt: Date.now(),
          entryFee: ENTRY_FEE,
          reward: REWARD,
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
      Alert.alert(t.error, t.notEnoughCoinOrPoints);
    } finally {
      setLoading(false);
    }
  };

  const listenForMyMatch = () => {
    if (!user) return;
    if (matchListListenerRef.current) return;

    const matchesRef = ref(db, "caylakMatchmaking/matches");

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

    await update(ref(db, `caylakMatchmaking/matches/${matchId}/players/${user.uid}`), {
      ready: true,
    });

    setStatusText("Hazır! Rakip bekleniyor...");
  };

  const attachMatchListener = (id: string) => {
    if (matchDetailListenerRef.current) return;

    const matchRef = ref(db, `caylakMatchmaking/matches/${id}`);

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

          const paymentOk = await payEntryFeeForBothPlayers(data.ownerUid, player2Uid);

          if (!paymentOk) {
            Alert.alert(t.error, t.errormy);
            await remove(matchRef);
            return;
          }

          await set(ref(db, `caylakRooms/${id}`), {
            league: "caylak",
            status: "playing",
            entryFee: ENTRY_FEE,
            reward: REWARD,
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

        navigation.replace("CaylakGameScreen", {
          roomId: id,
          league: "caylak",
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

          const matchRef = ref(db, `caylakMatchmaking/matches/${id}`);
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
        const matchRef = ref(db, `caylakMatchmaking/matches/${matchId}`);
        const snap = await get(matchRef);

        if (snap.exists() && snap.val().ownerUid === user.uid) {
          await remove(matchRef);
        }
      }
    }

    navigation.navigate("OnlineTabs", {
      screen: "OnlineHome",
    });
  };

  useEffect(() => {
    return () => {
      stopCountdown();

      if (matchListListenerRef.current) matchListListenerRef.current();
      if (matchDetailListenerRef.current) matchDetailListenerRef.current();

      if (user && !navigatedRef.current) {
        remove(ref(db, `activeUsers/${user.uid}`));
        removeMyWaiting();
      }
    };
  }, []);

  return (
    <LinearGradient colors={["#070712", "#101035", "#171753"]} style={styles.container}>
      <SafeAreaView style={styles.safe}>
        <View style={styles.glowOne} />
        <View style={styles.glowTwo} />

        <View style={styles.header}>
          <Text style={styles.logo}>MEMOLY</Text>
          <Text style={styles.subLogo}>ROOKIE MATCHMAKING</Text>
        </View>

        <View style={styles.heroCard}>
          <View style={styles.iconBadge}>
            <Icon name="account-search" size={40} color="#38BDF8" />
          </View>

          <Text style={styles.title}>ÇAYLAK LİGİ</Text>
          <Text style={styles.subtitle}>
            Rakip bul, hazır ol ve 4x4 hafıza düellosuna başla.
          </Text>

          <View style={styles.statsRow}>
            <View style={styles.statBox}>
              <Icon name="coin" size={24} color="#FACC15" />
              <Text style={styles.statLabel}>Giriş</Text>
              <Text style={styles.statValue}>{ENTRY_FEE}</Text>
            </View>

            <View style={styles.statBox}>
              <Icon name="trophy" size={24} color="#22C55E" />
              <Text style={styles.statLabel}>Ödül</Text>
              <Text style={styles.statValue}>{REWARD}</Text>
            </View>

            <View style={styles.statBox}>
              <Icon name="timer-outline" size={24} color="#00D2FF" />
              <Text style={styles.statLabel}>Süre</Text>
              <Text style={styles.statValue}>{matchId ? timer : 15}</Text>
            </View>
          </View>
        </View>

        <View style={styles.matchCard}>
          {!matchId ? (
            <>
              {loading || searching ? (
                <>
                  <ActivityIndicator size="large" color="#00D2FF" />
                  <Text style={styles.statusText}>Eşleşme aranıyor...</Text>
                </>
              ) : (
                <>
                  <TouchableOpacity
                    style={styles.primaryButton}
                    onPress={handleJoin}
                    activeOpacity={0.9}
                  >
                    <LinearGradient
                      colors={["#8E7CFF", "#6C5CE7", "#00D2FF"]}
                      style={styles.primaryGradient}
                    >
                      <Icon name="account-search" size={25} color="#FFFFFF" />
                      <Text style={styles.primaryText}>Eşleşmeye Başla</Text>
                    </LinearGradient>
                  </TouchableOpacity>

                  <Text style={styles.statusText}>{statusText}</Text>
                </>
              )}
            </>
          ) : (
            <>
              <View style={styles.foundBadge}>
                <Icon name="check-circle" size={32} color="#86EFAC" />
              </View>

              <Text style={styles.foundText}>Eşleşme Bulundu!</Text>

              <TouchableOpacity
                style={styles.primaryButton}
                onPress={handleReady}
                activeOpacity={0.9}
              >
                <LinearGradient
                  colors={["#22C55E", "#16A34A", "#00D2FF"]}
                  style={styles.primaryGradient}
                >
                  <Icon name="play" size={25} color="#FFFFFF" />
                  <Text style={styles.primaryText}>Oyna</Text>
                </LinearGradient>
              </TouchableOpacity>

              <Text style={styles.timerText}>Kalan süre: {timer} sn</Text>
              <Text style={styles.statusText}>{statusText}</Text>
            </>
          )}
        </View>

        <TouchableOpacity style={styles.homeButton} onPress={handleBackHome} activeOpacity={0.85}>
          <Icon name="home-outline" size={23} color="#00D2FF" />
          <Text style={styles.homeButtonText}>Ana Sayfa</Text>
          <Text style={styles.arrow}>›</Text>
        </TouchableOpacity>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },

  safe: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 28,
    paddingBottom: 28,
    justifyContent: "center",
  },

  glowOne: {
    position: "absolute",
    width: 280,
    height: 280,
    borderRadius: 140,
    backgroundColor: "rgba(108,92,231,0.34)",
    top: -100,
    right: -115,
  },

  glowTwo: {
    position: "absolute",
    width: 240,
    height: 240,
    borderRadius: 120,
    backgroundColor: "rgba(0,210,255,0.18)",
    bottom: 100,
    left: -115,
  },

  header: {
    alignItems: "center",
    marginBottom: 18,
  },

  logo: {
    color: "#FFFFFF",
    fontSize: 38,
    fontWeight: "900",
    letterSpacing: 3,
  },

  subLogo: {
    marginTop: 5,
    color: "#00D2FF",
    fontSize: 11,
    fontWeight: "900",
    letterSpacing: 2,
  },

  heroCard: {
    borderRadius: 30,
    padding: 18,
    backgroundColor: "rgba(255,255,255,0.08)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.16)",
    alignItems: "center",
    marginBottom: 14,
  },

  iconBadge: {
    width: 78,
    height: 78,
    borderRadius: 28,
    backgroundColor: "rgba(56,189,248,0.13)",
    borderWidth: 1,
    borderColor: "rgba(56,189,248,0.34)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 13,
  },

  title: {
    color: "#FFFFFF",
    fontSize: 30,
    fontWeight: "900",
    textAlign: "center",
  },

  subtitle: {
    marginTop: 8,
    color: "#D8D8F0",
    fontSize: 14,
    fontWeight: "700",
    textAlign: "center",
    lineHeight: 20,
  },

  statsRow: {
    width: "100%",
    flexDirection: "row",
    gap: 9,
    marginTop: 16,
  },

  statBox: {
    flex: 1,
    height: 78,
    borderRadius: 21,
    backgroundColor: "rgba(0,210,255,0.10)",
    borderWidth: 1,
    borderColor: "rgba(0,210,255,0.25)",
    alignItems: "center",
    justifyContent: "center",
  },

  statLabel: {
    marginTop: 4,
    color: "#AFAFD1",
    fontSize: 10,
    fontWeight: "900",
  },

  statValue: {
    marginTop: 1,
    color: "#FFFFFF",
    fontSize: 19,
    fontWeight: "900",
  },

  matchCard: {
    minHeight: 210,
    borderRadius: 30,
    padding: 18,
    backgroundColor: "rgba(255,255,255,0.08)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.16)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 14,
  },

  primaryButton: {
    width: "100%",
    borderRadius: 23,
    overflow: "hidden",
  },

  primaryGradient: {
    minHeight: 60,
    borderRadius: 23,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },

  primaryText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "900",
  },

  statusText: {
    marginTop: 14,
    color: "#D8D8F0",
    fontSize: 15,
    fontWeight: "800",
    textAlign: "center",
  },

  foundBadge: {
    width: 62,
    height: 62,
    borderRadius: 22,
    backgroundColor: "rgba(34,197,94,0.16)",
    borderWidth: 1,
    borderColor: "rgba(34,197,94,0.38)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
  },

  foundText: {
    color: "#FFFFFF",
    fontSize: 24,
    fontWeight: "900",
    marginBottom: 16,
  },

  timerText: {
    marginTop: 14,
    color: "#00D2FF",
    fontSize: 17,
    fontWeight: "900",
  },

  homeButton: {
    minHeight: 60,
    borderRadius: 22,
    backgroundColor: "rgba(255,255,255,0.08)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.16)",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 15,
  },

  homeButtonText: {
    flex: 1,
    marginLeft: 10,
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "900",
  },

  arrow: {
    color: "#00D2FF",
    fontSize: 30,
    fontWeight: "700",
  },
});