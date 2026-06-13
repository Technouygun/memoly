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
import { db } from "../../../../../../firebaseConfig";
import { useLanguage } from "../../../../../language/LanguageContext";

const EMOJIS = [
  "🤝",
  "🎮",
  "🧠",
  "🔥",
  "⭐",
  "🏆",
  "💎",
  "🚀",
  "🎯",
  "⚡",
  "🦊",
  "🌙",
];

const { width } = Dimensions.get("window");
const CARD_GAP = 6;
const CARD_SIZE = (width - 40 - CARD_GAP * 3) / 4;

type PlayerRole = "player1" | "player2";

type CardType = {
  id: string;
  value: string;
  matchedBy?: PlayerRole;
  openedBy?: PlayerRole;
};

const DEFAULT_COLORS = {
  player1: "#3B82F6",
  player2: "#EF4444",
};

const createDeck = () => {
  const cards = EMOJIS.flatMap((emoji, index) => [
    { id: `${index}-a`, value: emoji },
    { id: `${index}-b`, value: emoji },
  ]);

  return cards.sort(() => Math.random() - 0.5);
};

export default function ZorFriendGame() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const { roomId } = route.params;
  const { t } = useLanguage();
  const user = getAuth().currentUser;

  const [room, setRoom] = useState<any>(null);
  const [myRole, setMyRole] = useState<PlayerRole | null>(null);
  const [loading, setLoading] = useState(true);
  const [turnTimer, setTurnTimer] = useState(7);

  const lockRef = useRef(false);
  const resultNavigatedRef = useRef(false);
  const timeoutRunningRef = useRef(false);

  const roomRef = useMemo(() => ref(db, `zorFriendRooms/${roomId}`), [roomId]);

  const goFriendHome = () => {
    navigation.reset({
      index: 0,
      routes: [
        {
          name: "OnlineTabs",
          params: { screen: "FirstFriend" },
        },
      ],
    });
  };

  useEffect(() => {
    if (!user) return;

    const unsub = onValue(roomRef, async (snap) => {
      if (!snap.exists()) {
        Alert.alert(
          t.friendRoomNotFound || "Oda bulunamadı",
          t.friendRoomClosed || "Oyun odası kapatılmış olabilir.",
        );
        goFriendHome();
        return;
      }

      const data = snap.val();
      setRoom(data);

      if (data.status === "exited") {
        goFriendHome();
        return;
      }

      const p1Uid = data.players?.player1;
      const p2Uid = data.players?.player2;

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
          navigation.replace("ZorFriendDrawScreen", { roomId });
        } else {
          const winnerRole = p1Score > p2Score ? "player1" : "player2";

          if (winnerRole === role) {
            navigation.replace("ZorFriendWinScreen", { roomId });
          } else {
            navigation.replace("ZorFriendLoseScreen", { roomId });
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
      const turnLimit = room.settings?.turnTime ?? 7;

      if (turnLimit === 0) {
        setTurnTimer(0);
        return;
      }

      const elapsed = Math.floor((Date.now() - startedAt) / 1000);
      const remaining = Math.max(0, turnLimit - elapsed);

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
      }, 850);
    }
  };

  const getOpenCard = (card: CardType) => {
    const openCards: CardType[] = room?.openCards ?? [];
    return openCards.find((item) => item.id === card.id);
  };

  const isCardOpen = (card: CardType) => {
    return !!getOpenCard(card) || !!card.matchedBy;
  };

  const getCardOwnerRole = (card: CardType): PlayerRole | null => {
    const openCard = getOpenCard(card);
    return card.matchedBy || openCard?.openedBy || null;
  };

  if (loading || !room?.cards) {
    return (
      <LinearGradient
        colors={["#070712", "#101035", "#171753"]}
        style={styles.center}
      >
        <ActivityIndicator size="large" color="#00D2FF" />
        <Text style={styles.loadingText}>
          {t.hardFriendGamePreparing || "Oyun hazırlanıyor..."}
        </Text>
      </LinearGradient>
    );
  }

  const cards: CardType[] = room.cards;
  const p1Score = room.scores?.player1 ?? 0;
  const p2Score = room.scores?.player2 ?? 0;
  const myTurn = room.currentTurn === myRole;
  const playerColors = room.playerColors || DEFAULT_COLORS;
  const playerNames = room.playerNames || {
    player1: t.playerOne || "Oyuncu 1",
    player2: t.playerTwo || "Oyuncu 2",
  };
  const activeTurnName =
    playerNames[room.currentTurn as PlayerRole] || "Oyuncu";
  const turnLimit = room.settings?.turnTime ?? 7;

  return (
    <LinearGradient
      colors={["#070712", "#101035", "#171753"]}
      style={styles.container}
    >
      <SafeAreaView style={styles.safe}>
        <View style={{ height: 40}} />
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
              {myTurn ? t.yourTurn : t.friendPlaying}
            </Text>
            <Text
              style={[
                styles.turnName,
                {
                  color:
                    playerColors[room.currentTurn as PlayerRole] || "#FFFFFF",
                },
              ]}
              numberOfLines={1}
            >
              {activeTurnName}
            </Text>
          </View>

          <View style={styles.timerBox}>
            <Text style={styles.timerNumber}>
              {turnLimit === 0 ? "∞" : turnTimer}
            </Text>
            <Text style={styles.timerLabel}>{turnLimit === 0 ? "" : "SN"}</Text>
          </View>
        </View>

        <View style={styles.modeBox}>
          <Text style={styles.modeTitle}>ZOR MOD</Text>
          <Text style={styles.modeSub}>4x6 Arkadaş Düellosu</Text>
        </View>

        <View style={styles.scoreRow}>
          <View
            style={[
              styles.scoreCard,
              { borderColor: playerColors.player1 },
              room.currentTurn === "player1" && {
                backgroundColor: "rgba(59,130,246,0.18)",
                borderColor: playerColors.player1,
              },
            ]}
          >
            <Text style={styles.scoreLabel} numberOfLines={1}>
              {playerNames.player1}
            </Text>
            <Text style={styles.scoreValue}>{p1Score}</Text>
          </View>

          <View
            style={[
              styles.scoreCard,
              { borderColor: playerColors.player2 },
              room.currentTurn === "player2" && {
                backgroundColor: "rgba(239,68,68,0.18)",
                borderColor: playerColors.player2,
              },
            ]}
          >
            <Text style={styles.scoreLabel} numberOfLines={1}>
              {playerNames.player2}
            </Text>
            <Text style={styles.scoreValue}>{p2Score}</Text>
          </View>
        </View>

        <View style={styles.board}>
          {cards.map((card) => {
            const open = isCardOpen(card);
            const ownerRole = getCardOwnerRole(card);
            const ownerColor = ownerRole ? playerColors[ownerRole] : undefined;

            return (
              <TouchableOpacity
                key={card.id}
                style={[
                  styles.card,
                  open &&
                    ownerColor && {
                      backgroundColor:
                        ownerRole === "player1"
                          ? "rgba(59,130,246,0.30)"
                          : "rgba(239,68,68,0.30)",
                      borderColor: ownerColor,
                      shadowColor: ownerColor,
                      shadowOpacity: 0.55,
                      shadowRadius: 8,
                      elevation: 7,
                    },
                  open && !ownerColor && styles.openCard,
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
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 14,
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

  exitButton: {
    width: 40,
    height: 40,
    borderRadius: 15,
    backgroundColor: "rgba(239,68,68,0.20)",
    borderWidth: 1,
    borderColor: "rgba(239,68,68,0.45)",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 8,
  },

  exitText: {
    color: "#FFFFFF",
    fontSize: 32,
    fontWeight: "800",
    marginTop: -4,
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

  modeBox: {
    minHeight: 46,
    borderRadius: 18,
    backgroundColor: "rgba(255,255,255,0.08)",
    borderWidth: 1,
    borderColor: "rgba(251,146,60,0.35)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },

  modeTitle: {
    color: "#FB923C",
    fontSize: 13,
    fontWeight: "900",
    letterSpacing: 1.5,
  },

  modeSub: {
    color: "#D8D8F0",
    fontSize: 11,
    fontWeight: "800",
    marginTop: 1,
  },

  scoreRow: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 8,
  },

  scoreCard: {
    flex: 1,
    height: 50,
    borderRadius: 18,
    backgroundColor: "rgba(255,255,255,0.08)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.15)",
    alignItems: "center",
    justifyContent: "center",
  },

  activeScore: {
    backgroundColor: "rgba(0,210,255,0.16)",
    borderColor: "#00D2FF",
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
    borderRadius: 15,
    backgroundColor: "rgba(255,255,255,0.08)",
    borderWidth: 1.35,
    borderColor: "rgba(255,255,255,0.16)",
    alignItems: "center",
    justifyContent: "center",
  },

  openCard: {
    backgroundColor: "rgba(0,210,255,0.26)",
    borderColor: "#00D2FF",
  },

  matchedCard: {
    backgroundColor: "rgba(34,197,94,0.30)",
    borderColor: "#86EFAC",
  },

  cardText: {
    color: "#FFFFFF",
    fontSize: 29,
    fontWeight: "900",
  },
});
