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
import { db } from "../../../../../firebaseConfig";
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

type PlayerRole = "player1" | "player2";

type CardType = {
  id: string;
  value: string;
  matchedBy?: PlayerRole;
  openedBy?: PlayerRole;
};

const PLAYER_ONE_COLOR = "#3B82F6";
const PLAYER_TWO_COLOR = "#EF4444";

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
  const surrenderRunningRef = useRef(false);

  const roomRef = useMemo(() => ref(db, `zihinFinalRooms/${roomId}`), [roomId]);

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
        Alert.alert(
          t.roomNotFound || "Oda bulunamadı",
          t.finalRoomClosed || "Final odası kapatılmış olabilir."
        );
        goOnlineHome();
        return;
      }

      const data = snap.val();
      setRoom(data);

      if (data.status === "exited") {
        goOnlineHome();
        return;
      }

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
        });
      }

      if (data.status === "surrendered" && role && !resultNavigatedRef.current) {
        resultNavigatedRef.current = true;

        if (data.winnerRole === role) {
          navigation.replace("ZihinFinalWinScreen", { roomId });
        } else {
          navigation.replace("ZihinFinalLoseScreen", { roomId });
        }

        return;
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
      }, 650);
    }
  };

  const getOpenCardRole = (card: CardType): PlayerRole | undefined => {
    if (card.matchedBy) return card.matchedBy;

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
        <ActivityIndicator size="large" color="#FACC15" />
        <Text style={styles.loadingText}>
          {t.finalPreparing || "Final oyunu hazırlanıyor..."}
        </Text>
      </LinearGradient>
    );
  }

  const cards: CardType[] = room.cards;
  const p1Score = room.scores?.player1 ?? 0;
  const p2Score = room.scores?.player2 ?? 0;
  const myTurn = room.currentTurn === myRole;
  const currentTurnName =
    room.currentTurn === "player1" ? getPlayerName("player1") : getPlayerName("player2");

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
            <Text style={styles.turnLabel}>
              {myTurn ? t.yourTurn || "Sıra sende" : t.opponentPlaying || "Rakip oynuyor"}
            </Text>
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
  safe: { flex: 1, paddingHorizontal: 18, paddingTop: 8, paddingBottom: 8 },

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
    backgroundColor: "rgba(108,92,231,0.30)",
    top: -110,
    right: -110,
  },

  glowTwo: {
    position: "absolute",
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: "rgba(0,210,255,0.16)",
    bottom: 45,
    left: -110,
  },

  topLine: {
    height: 42,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 7,
  },

  surrenderButton: {
    width: 72,
    height: 38,
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
    height: 38,
    borderRadius: 15,
    backgroundColor: "rgba(255,255,255,0.08)",
    borderWidth: 1,
    borderColor: "rgba(0,210,255,0.28)",
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

  myTurn: { color: "#22C55E" },
  opponentTurn: { color: "#FB923C" },

  timerBox: {
    width: 50,
    height: 38,
    borderRadius: 15,
    backgroundColor: "rgba(0,210,255,0.14)",
    borderWidth: 1,
    borderColor: "rgba(0,210,255,0.38)",
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 8,
  },

  timerNumber: {
    color: "#FFFFFF",
    fontSize: 17,
    fontWeight: "900",
    lineHeight: 18,
  },

  timerLabel: {
    color: "#00D2FF",
    fontSize: 8,
    fontWeight: "900",
  },

  scoreRow: {
    flexDirection: "row",
    gap: 7,
    marginBottom: 7,
  },

  scoreCard: {
    flex: 1,
    height: 48,
    borderRadius: 16,
    backgroundColor: "rgba(255,255,255,0.08)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.15)",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 5,
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
    borderRadius: 9,
    backgroundColor: "rgba(255,255,255,0.08)",
    borderWidth: 1,
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
    fontSize: Math.max(15, CARD_SIZE * 0.45),
    fontWeight: "900",
  },
});
