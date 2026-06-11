import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Dimensions,
  SafeAreaView,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useNavigation, useRoute } from "@react-navigation/native";
import { getAuth } from "firebase/auth";
import { ref, onValue, update, get } from "firebase/database";
import { db } from "../../../../../firebaseConfig";
import { useLanguage } from "../../../../language/LanguageContext";

const { width, height } = Dimensions.get("window");

const EMOJIS = [
  "🍎", "🍌", "🍇", "🍓", "🍒", "🍉",
  "🥝", "🍍", "🍑", "🥥", "🍋", "🍊",
  "🍐", "🥭", "🍈", "🫐", "🍏", "🥑",
];

const CARD_GAP = 5;
const CARD_SIZE = Math.min(
  (width - 36 - CARD_GAP * 5) / 6,
  (height - 186 - CARD_GAP * 5) / 6
);

type PlayerRole = "player1" | "player2";

type CardType = {
  id: string;
  value: string;
  matchedBy?: PlayerRole;
};

const createDeck = () => {
  const cards = EMOJIS.flatMap((emoji, index) => [
    { id: `${index}-a`, value: emoji },
    { id: `${index}-b`, value: emoji },
  ]);

  return cards.sort(() => Math.random() - 0.5);
};

export default function HafizaGameScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const { roomId } = route.params;
  const { t } = useLanguage();

  const auth = getAuth();
  const user = auth.currentUser;

  const [room, setRoom] = useState<any>(null);
  const [myRole, setMyRole] = useState<PlayerRole | null>(null);
  const [loading, setLoading] = useState(true);
  const [turnTimer, setTurnTimer] = useState(7);

  const lockRef = useRef(false);
  const resultNavigatedRef = useRef(false);
  const timeoutRunningRef = useRef(false);

  const roomRef = useMemo(() => ref(db, `hafizaRooms/${roomId}`), [roomId]);

  const goOnlineHome = () => {
    navigation.reset({
      index: 0,
      routes: [{ name: "OnlineTabs", params: { screen: "OnlineHome" } }],
    });
  };

  useEffect(() => {
    if (!user) return;

    const unsub = onValue(roomRef, async (snap) => {
      if (!snap.exists()) {
        Alert.alert(t.roomNotFound || "Oda bulunamadı", t.roomClosed || "Oyun odası kapatılmış olabilir.");
        goOnlineHome();
        return;
      }

      const data = snap.val();
      setRoom(data);

      if (data.status === "exited") {
        goOnlineHome();
        return;
      }

      const p1Uid = data.players?.player1?.uid;
      const p2Uid = data.players?.player2?.uid;

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
        });
      }

      if (data.status === "finished" && role && !resultNavigatedRef.current) {
        resultNavigatedRef.current = true;

        const p1Score = data.scores?.player1 ?? 0;
        const p2Score = data.scores?.player2 ?? 0;

        if (p1Score === p2Score) {
          navigation.replace("HafizaDrawScreen", { roomId });
        } else {
          const winnerRole = p1Score > p2Score ? "player1" : "player2";

          if (winnerRole === role) {
            navigation.replace("HafizaWinScreen", { roomId });
          } else {
            navigation.replace("HafizaLoseScreen", { roomId });
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
      const remaining = Math.max(0, 7 - elapsed);

      setTurnTimer(remaining);

      if (remaining <= 0) {
        changeTurnByTimeout();
      }
    }, 300);

    return () => clearInterval(interval);
  }, [room?.currentTurn, room?.turnStartedAt, room?.status, myRole]);

  const handleCardPress = async (card: CardType) => {
    if (!room || !myRole || !user) return;
    if (lockRef.current) return;
    if (room.status !== "playing") return;
    if (room.currentTurn !== myRole) return;
    if (card.matchedBy) return;

    const openCards: CardType[] = room.openCards ?? [];

    const alreadyOpen = openCards.some((item) => item.id === card.id);
    if (alreadyOpen) return;
    if (openCards.length >= 2) return;

    const newOpenCards = [...openCards, card];

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

          const newScores = {
            ...freshScores,
            [myRole]: (freshScores[myRole] ?? 0) + 1,
          };

          const finished = updatedCards.every((item) => item.matchedBy);

          await update(roomRef, {
            cards: updatedCards,
            scores: newScores,
            openCards: [],
            status: finished ? "finished" : "playing",
            finishedAt: finished ? Date.now() : null,
            turnStartedAt: Date.now(),
          });
        } else {
          const nextTurn: PlayerRole =
            myRole === "player1" ? "player2" : "player1";

          await update(roomRef, {
            openCards: [],
            currentTurn: nextTurn,
            turnStartedAt: Date.now(),
          });
        }

        lockRef.current = false;
      }, 750);
    }
  };

  const isCardOpen = (card: CardType) => {
    const openCards: CardType[] = room?.openCards ?? [];
    return openCards.some((item) => item.id === card.id) || card.matchedBy;
  };

  if (loading || !room?.cards) {
    return (
      <LinearGradient colors={["#070712", "#101035", "#171753"]} style={styles.center}>
        <ActivityIndicator size="large" color="#C084FC" />
        <Text style={styles.loadingText}>
          {t.memoryGamePreparing || "Hafıza oyunu hazırlanıyor..."}
        </Text>
      </LinearGradient>
    );
  }

  const cards: CardType[] = room.cards;
  const p1Score = room.scores?.player1 ?? 0;
  const p2Score = room.scores?.player2 ?? 0;
  const myTurn = room.currentTurn === myRole;

  return (
    <LinearGradient colors={["#070712", "#101035", "#171753"]} style={styles.container}>
      <SafeAreaView style={styles.safe}>
        <View style={styles.glowOne} />
        <View style={styles.glowTwo} />

        <View style={styles.topLine}>
          <TouchableOpacity
            style={styles.exitButton}
            onPress={async () => {
              await update(roomRef, {
                status: "exited",
                exitedBy: user?.uid,
              });
            }}
            activeOpacity={0.85}
          >
            <Text style={styles.exitText}>‹</Text>
          </TouchableOpacity>

          <View style={styles.turnPill}>
            <Text style={styles.turnLabel}>
              {myTurn ? t.yourTurn || "SIRA SENDE" : t.opponentPlaying || "RAKİP OYNUYOR"}
            </Text>
            <Text style={[styles.turnName, myTurn ? styles.myTurn : styles.opponentTurn]}>
              {myTurn ? "SEN" : "RAKİP"}
            </Text>
          </View>

          <View style={styles.timerBox}>
            <Text style={styles.timerNumber}>{turnTimer}</Text>
            <Text style={styles.timerLabel}>SN</Text>
          </View>
        </View>

        <View style={styles.modeBox}>
          <Text style={styles.modeTitle}>HAFIZA USTASI</Text>
          <Text style={styles.modeSub}>6x6 Online Hafıza Düellosu</Text>
        </View>

        <View style={styles.scoreRow}>
          <View style={[styles.scoreCard, room.currentTurn === "player1" && styles.activeScore]}>
            <Text numberOfLines={1} style={styles.scoreLabel}>
              {room.players?.player1?.name || t.playerOne || "Oyuncu 1"}
            </Text>
            <Text style={styles.scoreValue}>{p1Score}</Text>
          </View>

          <View style={[styles.scoreCard, room.currentTurn === "player2" && styles.activeScore]}>
            <Text numberOfLines={1} style={styles.scoreLabel}>
              {room.players?.player2?.name || t.playerTwo || "Oyuncu 2"}
            </Text>
            <Text style={styles.scoreValue}>{p2Score}</Text>
          </View>
        </View>

        <View style={styles.board}>
          {cards.map((card) => {
            const open = isCardOpen(card);

            return (
              <TouchableOpacity
                key={card.id}
                style={[
                  styles.card,
                  open && styles.openCard,
                  card.matchedBy && styles.matchedCard,
                ]}
                onPress={() => handleCardPress(card)}
                activeOpacity={0.82}
                disabled={!myTurn || !!card.matchedBy}
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

  safe: {
    flex: 1,
    paddingHorizontal: 18,
    paddingTop: 8,
    paddingBottom: 8,
  },

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
    width: 250,
    height: 250,
    borderRadius: 125,
    backgroundColor: "rgba(192,132,252,0.24)",
    top: -110,
    right: -110,
  },

  glowTwo: {
    position: "absolute",
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: "rgba(0,210,255,0.18)",
    bottom: 45,
    left: -110,
  },

  topLine: {
    height: 42,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 5,
  },

  exitButton: {
    width: 36,
    height: 36,
    borderRadius: 14,
    backgroundColor: "rgba(239,68,68,0.20)",
    borderWidth: 1,
    borderColor: "rgba(239,68,68,0.45)",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 7,
  },

  exitText: {
    color: "#FFFFFF",
    fontSize: 30,
    fontWeight: "800",
    marginTop: -4,
  },

  turnPill: {
    flex: 1,
    height: 38,
    borderRadius: 15,
    backgroundColor: "rgba(255,255,255,0.08)",
    borderWidth: 1,
    borderColor: "rgba(192,132,252,0.30)",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 8,
  },

  turnLabel: {
    color: "#AFAFD1",
    fontSize: 8,
    fontWeight: "900",
    letterSpacing: 1,
  },

  turnName: {
    marginTop: 1,
    fontSize: 13,
    fontWeight: "900",
  },

  myTurn: {
    color: "#22C55E",
  },

  opponentTurn: {
    color: "#FB923C",
  },

  timerBox: {
    width: 50,
    height: 38,
    borderRadius: 15,
    backgroundColor: "rgba(192,132,252,0.14)",
    borderWidth: 1,
    borderColor: "rgba(192,132,252,0.40)",
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 7,
  },

  timerNumber: {
    color: "#FFFFFF",
    fontSize: 17,
    fontWeight: "900",
    lineHeight: 18,
  },

  timerLabel: {
    color: "#C084FC",
    fontSize: 8,
    fontWeight: "900",
  },

  modeBox: {
    height: 40,
    borderRadius: 16,
    backgroundColor: "rgba(255,255,255,0.08)",
    borderWidth: 1,
    borderColor: "rgba(192,132,252,0.34)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 6,
  },

  modeTitle: {
    color: "#C084FC",
    fontSize: 12,
    fontWeight: "900",
    letterSpacing: 1.5,
  },

  modeSub: {
    color: "#D8D8F0",
    fontSize: 10,
    fontWeight: "800",
    marginTop: 1,
  },

  scoreRow: {
    flexDirection: "row",
    gap: 7,
    marginBottom: 6,
  },

  scoreCard: {
    flex: 1,
    height: 46,
    borderRadius: 16,
    backgroundColor: "rgba(255,255,255,0.08)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.15)",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 5,
  },

  activeScore: {
    backgroundColor: "rgba(192,132,252,0.15)",
    borderColor: "#C084FC",
  },

  scoreLabel: {
    color: "#BFC0DD",
    fontSize: 10,
    fontWeight: "900",
    maxWidth: "100%",
  },

  scoreValue: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "900",
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
    borderRadius: 10,
    backgroundColor: "rgba(255,255,255,0.08)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.16)",
    alignItems: "center",
    justifyContent: "center",
  },

  openCard: {
    backgroundColor: "rgba(192,132,252,0.28)",
    borderColor: "#C084FC",
  },

  matchedCard: {
    backgroundColor: "rgba(34,197,94,0.30)",
    borderColor: "#86EFAC",
  },

  cardText: {
    color: "#FFFFFF",
    fontSize: Math.max(18, CARD_SIZE * 0.43),
    fontWeight: "900",
  },
});