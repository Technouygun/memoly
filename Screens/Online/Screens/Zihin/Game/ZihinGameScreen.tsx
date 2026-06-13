import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  SafeAreaView,
  Dimensions,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useNavigation, useRoute } from "@react-navigation/native";
import { getAuth } from "firebase/auth";
import { ref, onValue, update, get } from "firebase/database";
import { doc, onSnapshot, runTransaction } from "firebase/firestore";
import { db, firestore } from "../../../../../firebaseConfig";
import { useLanguage } from "../../../../language/LanguageContext";

const EMOJIS = [
  "🍎", "🍌", "🍇", "🍓", "🍒", "🍉",
  "🥝", "🍍", "🍑", "🍋", "🍊", "🥥",
  "🥕", "🌽", "🥦", "🍔", "🍕", "🍟",
  "⚽", "🏀", "🎲", "🎯", "🚗", "🚀",
];
const { width, height } = Dimensions.get("window");

const CARD_GAP = 4;
const CARD_SIZE = Math.min(
  (width - 36 - CARD_GAP * 7) / 8,
  (height - 210 - CARD_GAP * 5) / 6
);
const TURN_SECONDS = 7;

type PlayerRole = "player1" | "player2";

type CardType = {
  id: string;
  value: string;
  matchedBy?: PlayerRole;
  openedBy?: PlayerRole;
};

const PLAYER_ONE_COLOR = "#3B82F6";
const PLAYER_TWO_COLOR = "#EF4444";

const createInitialJokers = () => ({
  player1: { goldenActive: false },
  player2: { goldenActive: false },
});

type JokerCounts = {
  detective: number;
  bomb: number;
  golden: number;
};

const EMPTY_JOKER_COUNTS: JokerCounts = {
  detective: 0,
  bomb: 0,
  golden: 0,
};

const createDeck = () => {
  const cards = EMOJIS.flatMap((emoji, index) => [
    { id: `${index}-a`, value: emoji },
    { id: `${index}-b`, value: emoji },
  ]);

  return cards.sort(() => Math.random() - 0.5);
};

export default function ZihinGameScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const { roomId } = route.params;
  const { t } = useLanguage();

  const auth = getAuth();
  const user = auth.currentUser;

  const [room, setRoom] = useState<any>(null);
  const [myRole, setMyRole] = useState<PlayerRole | null>(null);
  const [loading, setLoading] = useState(true);
  const [turnTimer, setTurnTimer] = useState(TURN_SECONDS);
  const [detectiveTimer, setDetectiveTimer] = useState(0);
  const [myJokerCounts, setMyJokerCounts] = useState<JokerCounts>(EMPTY_JOKER_COUNTS);

  const lockRef = useRef(false);
  const resultNavigatedRef = useRef(false);
  const timeoutRunningRef = useRef(false);
  const surrenderRunningRef = useRef(false);
  const detectiveEndingRef = useRef(false);
  const jokerSpendRef = useRef(false);

  const roomRef = useMemo(() => ref(db, `zihinRooms/${roomId}`), [roomId]);


  const normalizeJokerCounts = (value: any): JokerCounts => ({
    detective: Math.max(0, Number(value?.detective ?? 0)),
    bomb: Math.max(0, Number(value?.bomb ?? 0)),
    golden: Math.max(0, Number(value?.golden ?? 0)),
  });

  const spendUserJoker = async (jokerKey: keyof JokerCounts) => {
    if (!user || jokerSpendRef.current) return false;

    jokerSpendRef.current = true;

    try {
      const userRef = doc(firestore, "users", user.uid);

      await runTransaction(firestore, async (transaction) => {
        const snap = await transaction.get(userRef);
        const counts = snap.exists()
          ? normalizeJokerCounts(snap.data()?.jokers)
          : EMPTY_JOKER_COUNTS;

        if ((counts[jokerKey] ?? 0) <= 0) {
          throw new Error("NO_JOKER");
        }

        transaction.update(userRef, {
          [`jokers.${jokerKey}`]: counts[jokerKey] - 1,
        });
      });

      return true;
    } catch (error: any) {
      if (error?.message === "NO_JOKER") {
        Alert.alert("Joker Yok", "Bu jokerden hiç kalmadı.");
        return false;
      }

      Alert.alert("Hata", "Joker kullanılırken bir sorun oluştu.");
      return false;
    } finally {
      jokerSpendRef.current = false;
    }
  };

  const getPlayerUid = (role: PlayerRole, data: any = room) => {
    const player = data?.players?.[role];

    if (typeof player === "string") return player;

    return player?.uid;
  };

  const getPlayerName = (role: PlayerRole) => {
    const player = room?.players?.[role];

    if (typeof player === "string") {
      return role === "player1" ? "Oyuncu 1" : "Oyuncu 2";
    }

    return (
      player?.nickname ||
      player?.displayName ||
      player?.name ||
      player?.email?.split("@")?.[0] ||
      (role === "player1" ? "Oyuncu 1" : "Oyuncu 2")
    );
  };

  useEffect(() => {
    if (!user?.uid) return;

    const unsub = onSnapshot(doc(firestore, "users", user.uid), (snap) => {
      const counts = snap.exists()
        ? normalizeJokerCounts(snap.data()?.jokers)
        : EMPTY_JOKER_COUNTS;

      setMyJokerCounts(counts);
    });

    return unsub;
  }, [user?.uid]);

  useEffect(() => {
    if (!user) return;

    const unsub = onValue(roomRef, async (snap) => {
      if (!snap.exists()) {
        Alert.alert(t.roomNotFound || "Oda bulunamadı", t.roomClosed || "Oda kapatıldı.");
        navigation.replace("OnlineTabs");
        return;
      }

      const data = snap.val();
      setRoom(data);

      const p1Uid = getPlayerUid("player1", data);
      const p2Uid = getPlayerUid("player2", data);

      const role =
        user.uid === p1Uid ? "player1" : user.uid === p2Uid ? "player2" : null;

      setMyRole(role);

      if (!data.cards && role === "player1") {
        await update(roomRef, {
          cards: createDeck(),
          currentTurn: "player1",
          openCards: [],
          scores: {
            player1: 0,
            player2: 0,
          },
          status: "playing",
          turnStartedAt: Date.now(),
          jokers: createInitialJokers(),
          detectiveJoker: { active: false, owner: null, cardId: null, endsAt: null },
        });
      }

      if (data.cards && !data.jokers && role === "player1") {
        await update(roomRef, {
          jokers: createInitialJokers(),
          detectiveJoker: { active: false, owner: null, cardId: null, endsAt: null },
        });
      }

      if (data.status === "surrendered" && role && !resultNavigatedRef.current) {
        resultNavigatedRef.current = true;

        if (data.winnerRole === role) {
          navigation.replace("ZihinWinScreen", { roomId });
        } else {
          navigation.replace("ZihinLoseScreen", { roomId });
        }

        return;
      }

      if (data.status === "finished" && role && !resultNavigatedRef.current) {
        resultNavigatedRef.current = true;

        const p1Score = data.scores?.player1 ?? 0;
        const p2Score = data.scores?.player2 ?? 0;

        if (p1Score === p2Score) {
          navigation.replace("ZihinDrawScreen", { roomId });
        } else {
          const winnerRole = p1Score > p2Score ? "player1" : "player2";

          if (winnerRole === role) {
            navigation.replace("ZihinWinScreen", { roomId });
          } else {
            navigation.replace("ZihinLoseScreen", { roomId });
          }
        }
      }

      setLoading(false);
    });

    return () => unsub();
  }, [user]);

  const changeTurnByTimeout = async () => {
    if (!room || !myRole) return;
    if (room.status !== "playing") return;
    if (room.currentTurn !== myRole) return;
    if (room.detectiveJoker?.active) return;
    if (timeoutRunningRef.current) return;

    timeoutRunningRef.current = true;

    const nextTurn: PlayerRole =
      room.currentTurn === "player1" ? "player2" : "player1";

    await update(roomRef, {
      openCards: [],
      currentTurn: nextTurn,
      turnStartedAt: Date.now(),
    });

    timeoutRunningRef.current = false;
  };

  useEffect(() => {
    if (!room || room.status !== "playing" || !room.currentTurn) return;

    const interval = setInterval(() => {
      const startedAt = room.turnStartedAt ?? Date.now();
      const elapsed = Math.floor((Date.now() - startedAt) / 1000);
      if (room.detectiveJoker?.active) return;
      const remaining = Math.max(0, TURN_SECONDS - elapsed);

      setTurnTimer(remaining);

      if (remaining <= 0) {
        changeTurnByTimeout();
      }
    }, 300);

    return () => clearInterval(interval);
  }, [room?.currentTurn, room?.turnStartedAt, room?.status, room?.detectiveJoker?.active, myRole]);



  useEffect(() => {
    if (!room?.detectiveJoker?.active || !room?.detectiveJoker?.endsAt) {
      setDetectiveTimer(0);
      return;
    }

    const tick = () => {
      const remainingMs = Math.max(0, room.detectiveJoker.endsAt - Date.now());
      setDetectiveTimer(Math.ceil(remainingMs / 1000));
    };

    tick();
    const interval = setInterval(tick, 150);

    return () => clearInterval(interval);
  }, [room?.detectiveJoker?.active, room?.detectiveJoker?.endsAt]);

  useEffect(() => {
    if (!room?.detectiveJoker?.active || !room?.detectiveJoker?.endsAt) return;
    if (detectiveEndingRef.current) return;

    const remaining = Math.max(0, room.detectiveJoker.endsAt - Date.now());

    const timer = setTimeout(async () => {
      if (detectiveEndingRef.current) return;
      detectiveEndingRef.current = true;

      await update(roomRef, {
        detectiveJoker: { active: false, owner: null, cardId: null, endsAt: null },
        turnStartedAt: Date.now(),
      });

      detectiveEndingRef.current = false;
    }, remaining);

    return () => clearTimeout(timer);
  }, [room?.detectiveJoker?.active, room?.detectiveJoker?.endsAt]);

  const getMyJokers = () => {
    if (!myRole) return null;
    return room?.jokers?.[myRole] ?? createInitialJokers()[myRole];
  };

  const useDetectiveJoker = async () => {
    if (!room || !myRole) return;
    if (room.status !== "playing" || room.currentTurn !== myRole) return;
    if ((myJokerCounts.detective ?? 0) <= 0) {
      Alert.alert("Joker Yok", "Dedektif jokerin kalmadı.");
      return;
    }

    const spent = await spendUserJoker("detective");
    if (!spent) return;

    await update(roomRef, {
      detectiveJoker: {
        active: true,
        owner: myRole,
        cardId: null,
        endsAt: Date.now() + 4000,
      },
    });
  };

  const useBombJoker = async () => {
    if (!room || !myRole) return;
    if (room.status !== "playing" || room.currentTurn === myRole) return;
    if ((myJokerCounts.bomb ?? 0) <= 0) {
      Alert.alert("Joker Yok", "Bomba jokerin kalmadı.");
      return;
    }

    const spent = await spendUserJoker("bomb");
    if (!spent) return;

    await update(roomRef, {
      openCards: [],
      currentTurn: myRole,
      turnStartedAt: Date.now(),
      detectiveJoker: { active: false, owner: null, cardId: null, endsAt: null },
    });
  };

  const useGoldenJoker = async () => {
    if (!room || !myRole) return;
    if (room.status !== "playing" || room.currentTurn !== myRole) return;
    if ((myJokerCounts.golden ?? 0) <= 0) {
      Alert.alert("Joker Yok", "Altın eşleşme jokerin kalmadı.");
      return;
    }

    const spent = await spendUserJoker("golden");
    if (!spent) return;

    await update(roomRef, {
      [`jokers/${myRole}/goldenActive`]: true,
    });
  };

  const surrenderGame = async () => {
    if (!room || !myRole || !user) return;
    if (room.status !== "playing") return;
    if (surrenderRunningRef.current) return;

    const winnerRole: PlayerRole = myRole === "player1" ? "player2" : "player1";

    surrenderRunningRef.current = true;

    await update(roomRef, {
      status: "surrendered",
      surrenderedBy: user.uid,
      loserRole: myRole,
      winnerRole,
      openCards: [],
      finishedAt: Date.now(),
    });

    surrenderRunningRef.current = false;
  };

  const confirmSurrender = () => {
    Alert.alert(
      "Pes Et",
      "Pes edersen kaybedersin. Emin misin?",
      [
        { text: "Vazgeç", style: "cancel" },
        {
          text: "Pes Et",
          style: "destructive",
          onPress: surrenderGame,
        },
      ]
    );
  };

  const handleCardPress = async (card: CardType) => {
    if (!room || !myRole || !user) return;
    if (lockRef.current) return;
    if (room.status !== "playing") return;
    if (room.currentTurn !== myRole) return;
    if (card.matchedBy) return;

    if (room.detectiveJoker?.active && room.detectiveJoker?.owner === myRole) {
      if (room.detectiveJoker?.cardId) return;

      await update(roomRef, {
        "detectiveJoker/cardId": card.id,
      });
      return;
    }

    const openCards: CardType[] = room.openCards ?? [];
    const alreadyOpen = openCards.some((item) => item.id === card.id);

    if (alreadyOpen) return;
    if (openCards.length >= 2) return;

    const newOpenCards = [...openCards, { ...card, openedBy: myRole }];

    await update(roomRef, {
      openCards: newOpenCards,
    });

    if (newOpenCards.length === 2) {
      lockRef.current = true;

      const [first, second] = newOpenCards;
      const isMatch = first.value === second.value;

      setTimeout(async () => {
        const freshSnap = await get(roomRef);
        if (!freshSnap.exists()) return;

        const freshRoom = freshSnap.val();
        if (freshRoom.status !== "playing") {
          lockRef.current = false;
          return;
        }

        const freshCards: CardType[] = freshRoom.cards ?? [];
        const freshScores = freshRoom.scores ?? { player1: 0, player2: 0 };

        if (isMatch) {
          const updatedCards = freshCards.map((item) => {
            if (item.id === first.id || item.id === second.id) {
              return {
                ...item,
                matchedBy: myRole,
              };
            }

            return item;
          });

          const goldenActive = !!freshRoom.jokers?.[myRole]?.goldenActive;
          const point = goldenActive ? 2 : 1;

          const newScores = {
            ...freshScores,
            [myRole]: (freshScores[myRole] ?? 0) + point,
          };

          const finished = updatedCards.every((item) => item.matchedBy);


          await update(roomRef, {
            cards: updatedCards,
            scores: newScores,
            openCards: [],
            status: finished ? "finished" : "playing",
            finishedAt: finished ? Date.now() : null,
            turnStartedAt: Date.now(),
            [`jokers/${myRole}/goldenActive`]: false,
          });
        } else {
          const nextTurn: PlayerRole = myRole === "player1" ? "player2" : "player1";

          await update(roomRef, {
            openCards: [],
            currentTurn: nextTurn,
            turnStartedAt: Date.now(),
            [`jokers/${myRole}/goldenActive`]: false,
          });
        }

        lockRef.current = false;
      }, 850);
    }
  };

  const getOpenCardRole = (card: CardType): PlayerRole | undefined => {
    if (card.matchedBy) return card.matchedBy;
    if (room?.detectiveJoker?.cardId === card.id) return room.detectiveJoker.owner;

    const openCards: CardType[] = room?.openCards ?? [];
    const openedCard = openCards.find((item) => item.id === card.id);

    return openedCard?.openedBy ?? (openedCard ? room?.currentTurn : undefined);
  };

  const isCardOpen = (card: CardType) => {
    return !!getOpenCardRole(card);
  };

  if (loading || !room?.cards) {
    return (
      <LinearGradient colors={["#070712", "#101035", "#171753"]} style={styles.center}>
        <ActivityIndicator size="large" color="#00D2FF" />
        <Text style={styles.loadingText}>{t.gamePreparing || "Oyun hazırlanıyor..."}</Text>
      </LinearGradient>
    );
  }

  const cards: CardType[] = room.cards;
  const p1Score = room.scores?.player1 ?? 0;
  const p2Score = room.scores?.player2 ?? 0;
  const myTurn = room.currentTurn === myRole;
  const currentTurnName =
    room.currentTurn === "player1" ? getPlayerName("player1") : getPlayerName("player2");
  const myJokers = getMyJokers();
  const detectiveReady = myTurn && myJokerCounts.detective > 0 && !room.detectiveJoker?.active;
  const bombReady = !myTurn && myJokerCounts.bomb > 0;
  const goldenReady = myTurn && myJokerCounts.golden > 0 && !myJokers?.goldenActive;
  const goldenActive = !!myJokers?.goldenActive;

  return (
    <LinearGradient colors={["#070712", "#101035", "#171753"]} style={styles.container}>
      <SafeAreaView style={styles.safe}>
        <View style={styles.glowOne} />
        <View style={styles.glowTwo} />

        <View style={styles.topLine}>
          <TouchableOpacity
            style={styles.surrenderButton}
            onPress={confirmSurrender}
            activeOpacity={0.85}
            disabled={room.status !== "playing"}
          >
            <Text style={styles.surrenderText}>Pes Et</Text>
          </TouchableOpacity>

          <View style={styles.turnPill}>
            <Text style={styles.turnLabel}>{myTurn ? t.yourTurn || "Sıra sende" : t.opponentPlaying || "Rakip oynuyor"}</Text>
            <Text style={[styles.turnName, myTurn ? styles.myTurn : styles.opponentTurn]}>
              {myTurn ? "SEN" : currentTurnName}
            </Text>
          </View>

          <View style={styles.timerBox}>
            <Text style={styles.timerNumber}>{turnTimer}</Text>
            <Text style={styles.timerLabel}>SN</Text>
          </View>
        </View>

        <View style={styles.scoreRow}>
          <View
            style={[
              styles.scoreCard,
              styles.playerOneScore,
              room.currentTurn === "player1" && styles.activePlayerOneScore,
            ]}
          >
            <Text numberOfLines={1} style={styles.scoreLabel}>{getPlayerName("player1")}</Text>
            <Text style={styles.scoreValue}>{p1Score}</Text>
          </View>

          <View
            style={[
              styles.scoreCard,
              styles.playerTwoScore,
              room.currentTurn === "player2" && styles.activePlayerTwoScore,
            ]}
          >
            <Text numberOfLines={1} style={styles.scoreLabel}>{getPlayerName("player2")}</Text>
            <Text style={styles.scoreValue}>{p2Score}</Text>
          </View>
        </View>

        <View style={styles.jokerPanel}>
          <TouchableOpacity
            style={[
              styles.jokerButton,
              styles.detectiveJoker,
              !detectiveReady && styles.jokerDisabled,
            ]}
            activeOpacity={0.86}
            onPress={useDetectiveJoker}
            disabled={!detectiveReady}
          >
            <LinearGradient
              colors={["rgba(0,210,255,0.30)", "rgba(14,165,233,0.10)"]}
              style={styles.jokerGradient}
            >
              <Text style={styles.jokerIcon}>⌕</Text>
              <View style={styles.jokerTextBox}>
                <Text style={styles.jokerTitle}>DEDEKTİF</Text>
                <Text style={styles.jokerSub}>4 SN TARAMA</Text>
              </View>
              <View style={styles.jokerCountBadge}>
                <Text style={styles.jokerCountText}>x{myJokerCounts.detective}</Text>
              </View>
              <View style={styles.jokerStatusDot} />
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.jokerButton,
              styles.bombJoker,
              !bombReady && styles.jokerDisabled,
            ]}
            activeOpacity={0.86}
            onPress={useBombJoker}
            disabled={!bombReady}
          >
            <LinearGradient
              colors={["rgba(239,68,68,0.34)", "rgba(249,115,22,0.10)"]}
              style={styles.jokerGradient}
            >
              <Text style={styles.jokerIcon}>✦</Text>
              <View style={styles.jokerTextBox}>
                <Text style={styles.jokerTitle}>BOMBA</Text>
                <Text style={styles.jokerSub}>SIRA KIRICI</Text>
              </View>
              <View style={styles.jokerCountBadge}>
                <Text style={styles.jokerCountText}>x{myJokerCounts.bomb}</Text>
              </View>
              <View style={styles.jokerStatusDot} />
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.jokerButton,
              styles.goldenJoker,
              goldenActive && styles.goldenActiveJoker,
              !goldenReady && !goldenActive && styles.jokerDisabled,
            ]}
            activeOpacity={0.86}
            onPress={useGoldenJoker}
            disabled={!goldenReady}
          >
            <LinearGradient
              colors={["rgba(250,204,21,0.38)", "rgba(234,179,8,0.10)"]}
              style={styles.jokerGradient}
            >
              <Text style={styles.jokerIcon}>◆</Text>
              <View style={styles.jokerTextBox}>
                <Text style={styles.jokerTitle}>ALTIN</Text>
                <Text style={styles.jokerSub}>{goldenActive ? "2X AKTİF" : "2X PUAN"}</Text>
              </View>
              <View style={styles.jokerCountBadge}>
                <Text style={styles.jokerCountText}>x{myJokerCounts.golden}</Text>
              </View>
              <View style={styles.jokerStatusDot} />
            </LinearGradient>
          </TouchableOpacity>
        </View>

        {room.detectiveJoker?.active && room.detectiveJoker?.owner === myRole && (
          <View style={styles.detectiveTimerPanel}>
            <Text style={styles.detectiveTimerTitle}>DEDEKTİF MODU</Text>
            <Text style={styles.detectiveTimerText}>{detectiveTimer} SN</Text>
            <Text style={styles.detectiveTimerSub}>
              {room.detectiveJoker?.cardId ? "Kart seçildi. Süre bitince kapanacak." : "Sadece 1 kart seçebilirsin."}
            </Text>
          </View>
        )}

        <View style={styles.board}>
          {cards.map((card) => {
            const open = isCardOpen(card);
            const openCardRole = getOpenCardRole(card);

            return (
              <TouchableOpacity
                key={card.id}
                style={[
                  styles.card,
                  open && styles.openCard,
                  openCardRole === "player1" && styles.playerOneOpenCard,
                  openCardRole === "player2" && styles.playerTwoOpenCard,
                  card.matchedBy === "player1" && styles.playerOneMatchedCard,
                  card.matchedBy === "player2" && styles.playerTwoMatchedCard,
                ]}
                onPress={() => handleCardPress(card)}
                activeOpacity={0.82}
                disabled={(!myTurn && !room.detectiveJoker?.active) || !!card.matchedBy}
              >
                <Text style={styles.cardText}>{open ? card.value : "?"}</Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  safe: { flex: 1, paddingHorizontal: 20, paddingTop: 10, paddingBottom: 14 },

  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },

  loadingText: {
    color: "#FFFFFF",
    marginTop: 12,
    fontSize: 16,
    fontWeight: "900",
  },

  glowOne: {
    position: "absolute",
    width: 240,
    height: 240,
    borderRadius: 120,
    backgroundColor: "rgba(108,92,231,0.30)",
    top: -100,
    right: -100,
  },

  glowTwo: {
    position: "absolute",
    width: 210,
    height: 210,
    borderRadius: 105,
    backgroundColor: "rgba(0,210,255,0.16)",
    bottom: 40,
    left: -100,
  },

  topLine: {
    height: 46,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },

  surrenderButton: {
    width: 72,
    height: 40,
    borderRadius: 15,
    backgroundColor: "rgba(239,68,68,0.20)",
    borderWidth: 1,
    borderColor: "rgba(239,68,68,0.45)",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 8,
  },

  surrenderText: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "900",
  },

  turnPill: {
    flex: 1,
    height: 42,
    borderRadius: 16,
    backgroundColor: "rgba(255,255,255,0.08)",
    borderWidth: 1,
    borderColor: "rgba(0,210,255,0.28)",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 10,
  },

  turnLabel: {
    color: "#AFAFD1",
    fontSize: 9,
    fontWeight: "900",
    letterSpacing: 1,
  },

  turnName: {
    marginTop: 1,
    fontSize: 14,
    fontWeight: "900",
  },

  myTurn: { color: "#22C55E" },
  opponentTurn: { color: "#FB923C" },

  timerBox: {
    width: 54,
    height: 42,
    borderRadius: 16,
    backgroundColor: "rgba(0,210,255,0.14)",
    borderWidth: 1,
    borderColor: "rgba(0,210,255,0.38)",
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 8,
  },

  timerNumber: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "900",
    lineHeight: 19,
  },

  timerLabel: {
    color: "#00D2FF",
    fontSize: 8,
    fontWeight: "900",
  },

  scoreRow: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 12,
  },

  scoreCard: {
    flex: 1,
    height: 56,
    borderRadius: 18,
    backgroundColor: "rgba(255,255,255,0.08)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.15)",
    alignItems: "center",
    justifyContent: "center",
  },

  playerOneScore: {
    borderColor: PLAYER_ONE_COLOR,
  },

  playerTwoScore: {
    borderColor: PLAYER_TWO_COLOR,
  },

  activePlayerOneScore: {
    backgroundColor: "rgba(59,130,246,0.20)",
    borderColor: PLAYER_ONE_COLOR,
  },

  activePlayerTwoScore: {
    backgroundColor: "rgba(239,68,68,0.20)",
    borderColor: PLAYER_TWO_COLOR,
  },

  scoreLabel: {
    color: "#BFC0DD",
    fontSize: 11,
    fontWeight: "900",
  },

  scoreValue: {
    color: "#FFFFFF",
    fontSize: 20,
    fontWeight: "900",
    marginTop: 1,
  },



  jokerPanel: {
    height: 58,
    flexDirection: "row",
    gap: 7,
    marginBottom: 8,
  },

  jokerButton: {
    flex: 1,
    borderRadius: 18,
    overflow: "hidden",
    borderWidth: 1.2,
    backgroundColor: "rgba(255,255,255,0.06)",
    shadowColor: "#00D2FF",
    shadowOpacity: 0.28,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 0 },
    elevation: 5,
  },

  jokerGradient: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8,
    position: "relative",
  },

  detectiveJoker: {
    borderColor: "rgba(0,210,255,0.72)",
  },

  bombJoker: {
    borderColor: "rgba(239,68,68,0.72)",
  },

  goldenJoker: {
    borderColor: "rgba(250,204,21,0.76)",
  },

  goldenActiveJoker: {
    backgroundColor: "rgba(250,204,21,0.18)",
    borderColor: "#FACC15",
    shadowColor: "#FACC15",
    shadowOpacity: 0.55,
  },

  jokerDisabled: {
    opacity: 0.34,
    shadowOpacity: 0,
    elevation: 0,
  },

  jokerIcon: {
    width: 25,
    height: 25,
    borderRadius: 9,
    backgroundColor: "rgba(255,255,255,0.14)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.24)",
    color: "#FFFFFF",
    fontSize: 17,
    fontWeight: "900",
    textAlign: "center",
    lineHeight: 24,
    marginRight: 6,
  },

  jokerTextBox: {
    flex: 1,
  },

  jokerTitle: {
    color: "#FFFFFF",
    fontSize: 9,
    fontWeight: "900",
    letterSpacing: 0.7,
  },

  jokerSub: {
    color: "#BFEFFF",
    fontSize: 7,
    fontWeight: "900",
    letterSpacing: 0.5,
    marginTop: 2,
  },

  jokerCountBadge: {
    position: "absolute",
    right: 6,
    bottom: 6,
    minWidth: 25,
    height: 17,
    borderRadius: 9,
    backgroundColor: "rgba(0,0,0,0.35)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.22)",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 5,
  },

  jokerCountText: {
    color: "#FFFFFF",
    fontSize: 9,
    fontWeight: "900",
  },

  jokerStatusDot: {
    position: "absolute",
    top: 8,
    right: 8,
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#22C55E",
  },

  detectiveTimerPanel: {
    minHeight: 44,
    borderRadius: 17,
    backgroundColor: "rgba(0,210,255,0.12)",
    borderWidth: 1,
    borderColor: "rgba(0,210,255,0.52)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
    paddingVertical: 6,
    shadowColor: "#00D2FF",
    shadowOpacity: 0.28,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 0 },
    elevation: 5,
  },

  detectiveTimerTitle: {
    color: "#BFEFFF",
    fontSize: 9,
    fontWeight: "900",
    letterSpacing: 1.2,
  },

  detectiveTimerText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "900",
    lineHeight: 20,
  },

  detectiveTimerSub: {
    color: "#AFAFD1",
    fontSize: 9,
    fontWeight: "800",
    marginTop: 1,
  },

  board: {
    flex: 1,
    flexDirection: "row",
    flexWrap: "wrap",
    gap: CARD_GAP,
    justifyContent: "center",
    alignContent: "center",
  },

  card: {
    width: CARD_SIZE,
    height: CARD_SIZE,
    borderRadius: 17,
    backgroundColor: "rgba(255,255,255,0.08)",
    borderWidth: 1.4,
    borderColor: "rgba(255,255,255,0.16)",
    alignItems: "center",
    justifyContent: "center",
  },

  openCard: {
    backgroundColor: "rgba(0,210,255,0.18)",
    borderColor: "#00D2FF",
  },

  playerOneOpenCard: {
    backgroundColor: "rgba(59,130,246,0.34)",
    borderColor: PLAYER_ONE_COLOR,
  },

  playerTwoOpenCard: {
    backgroundColor: "rgba(239,68,68,0.34)",
    borderColor: PLAYER_TWO_COLOR,
  },

  playerOneMatchedCard: {
    backgroundColor: "rgba(59,130,246,0.30)",
    borderColor: PLAYER_ONE_COLOR,
  },

  playerTwoMatchedCard: {
    backgroundColor: "rgba(239,68,68,0.30)",
    borderColor: PLAYER_TWO_COLOR,
  },

  cardText: {
    color: "#FFFFFF",
    fontSize: 34,
    fontWeight: "900",
  },
});
