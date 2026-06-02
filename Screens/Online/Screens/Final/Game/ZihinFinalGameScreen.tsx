import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  ScrollView,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { getAuth } from "firebase/auth";
import { ref, onValue, update, get } from "firebase/database";
import { db } from "../../../../../firebaseConfig";

const EMOJIS = [
  "🍎", "🍌", "🍇", "🍓", "🍒", "🍉",
  "🥝", "🍍", "🍑", "🍋", "🍊", "🥥",
  "🥕", "🌽", "🥦", "🍔", "🍕", "🍟",
  "⚽", "🏀", "🎲", "🎯", "🚗", "🚀",
];

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

export default function ZihinFinalGameScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const { roomId } = route.params;

  const user = getAuth().currentUser;

  const [room, setRoom] = useState<any>(null);
  const [myRole, setMyRole] = useState<PlayerRole | null>(null);
  const [loading, setLoading] = useState(true);
  const [turnTimer, setTurnTimer] = useState(7);

  const lockRef = useRef(false);
  const resultNavigatedRef = useRef(false);
  const timeoutRunningRef = useRef(false);

  const roomRef = useMemo(() => ref(db, `zihinFinalRooms/${roomId}`), [roomId]);

  useEffect(() => {
    if (!user) return;

    const unsub = onValue(roomRef, async (snap) => {
      if (!snap.exists()) {
        Alert.alert("Oda bulunamadı", "Final oyun odası kapatılmış olabilir.");
        navigation.replace("FirstOnline");
        return;
      }

      const data = snap.val();
      setRoom(data);

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
          scores: { player1: 0, player2: 0 },
          status: "playing",
          turnStartedAt: Date.now(),
        });
      }

      if (data.status === "finished" && role && !resultNavigatedRef.current) {
        resultNavigatedRef.current = true;

        const p1Score = data.scores?.player1 ?? 0;
        const p2Score = data.scores?.player2 ?? 0;

        if (p1Score === p2Score) {
          navigation.replace("ZihinFinalDrawScreen", { roomId });
        } else {
          const winnerRole = p1Score > p2Score ? "player1" : "player2";

          if (winnerRole === role) {
            navigation.replace("ZihinFinalWinScreen", { roomId });
          } else {
            navigation.replace("ZihinFinalLoseScreen", { roomId });
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

    if (openCards.some((item) => item.id === card.id)) return;
    if (openCards.length >= 2) return;

    const newOpenCards = [...openCards, card];

    await update(roomRef, { openCards: newOpenCards });

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
              return { ...item, matchedBy: myRole };
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
      }, 850);
    }
  };

  const isCardOpen = (card: CardType) => {
    const openCards: CardType[] = room?.openCards ?? [];
    return openCards.some((item) => item.id === card.id) || card.matchedBy;
  };

  if (loading || !room?.cards) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#facc15" />
        <Text style={styles.loadingText}>Zihin Final hazırlanıyor...</Text>
      </View>
    );
  }

  const cards: CardType[] = room.cards;
  const p1Score = room.scores?.player1 ?? 0;
  const p2Score = room.scores?.player2 ?? 0;
  const myTurn = room.currentTurn === myRole;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Zihin Dehası Final</Text>

      <View style={styles.scoreBox}>
        <Text style={styles.scoreText}>Oyuncu 1: {p1Score}</Text>
        <Text style={styles.scoreText}>Oyuncu 2: {p2Score}</Text>
      </View>

      <Text style={[styles.turnText, myTurn ? styles.myTurn : styles.opponentTurn]}>
        {myTurn ? "Sıra sende" : "Rakip oynuyor"}
      </Text>

      <Text style={styles.timerText}>Süre: {turnTimer}</Text>

      <ScrollView contentContainerStyle={styles.scrollContent}>
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
                activeOpacity={0.8}
                disabled={!myTurn || !!card.matchedBy}
              >
                <Text style={styles.cardText}>{open ? card.value : "?"}</Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    backgroundColor: "#1c1917",
    alignItems: "center",
    justifyContent: "center",
  },
  loadingText: {
    color: "#fff",
    marginTop: 12,
    fontSize: 17,
    fontWeight: "700",
  },
  container: {
    flex: 1,
    backgroundColor: "#1c1917",
    paddingTop: 50,
    paddingHorizontal: 10,
    alignItems: "center",
  },
  title: {
    fontSize: 30,
    color: "#facc15",
    fontWeight: "900",
    marginBottom: 12,
    textAlign: "center",
  },
  scoreBox: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "rgba(255,255,255,0.12)",
    borderRadius: 16,
    padding: 12,
    marginBottom: 10,
  },
  scoreText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "800",
  },
  turnText: {
    fontSize: 19,
    fontWeight: "900",
    marginBottom: 6,
  },
  myTurn: {
    color: "#22c55e",
  },
  opponentTurn: {
    color: "#f97316",
  },
  timerText: {
    fontSize: 26,
    fontWeight: "900",
    color: "#facc15",
    marginBottom: 10,
  },
  scrollContent: {
    paddingBottom: 30,
  },
  board: {
    width: "100%",
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: 5,
  },
  card: {
    width: "15%",
    aspectRatio: 1,
    backgroundColor: "#92400e",
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  openCard: {
    backgroundColor: "#fff",
  },
  matchedCard: {
    backgroundColor: "#86efac",
  },
  cardText: {
    fontSize: 22,
    fontWeight: "900",
  },
});