import React, { useEffect, useMemo, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Alert,
  Dimensions,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useNavigation, useRoute } from "@react-navigation/native";

type BoardSize = "4x4" | "4x5" | "4x6" | "4x7";
type PlayerCount = 2 | 3 | 4;
type TurnTime = 7 | 14 | 0;

type PlayerRouteInfo = {
  id: number;
  name: string;
  color: string;
};

type CardItem = {
  id: number;
  value: string;
  isOpen: boolean;
  isMatched: boolean;
};

const emojis = [
  "🍎",
  "🍌",
  "🍇",
  "🍓",
  "🍉",
  "🍒",
  "🥝",
  "🍍",
  "🥥",
  "🥕",
  "🌽",
  "🥑",
  "🍔",
  "🍕",
];

const CARDS_PER_ROW = 4;
const GAP = 5;
const SCREEN_WIDTH = Dimensions.get("window").width;
const SCREEN_HEIGHT = Dimensions.get("window").height;

export default function GameScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();

  const boardSize: BoardSize = route.params?.boardSize ?? "4x4";
  const playerCount: PlayerCount = route.params?.playerCount ?? 2;
  const turnTime: TurnTime = route.params?.turnTime ?? 7;

  const players: PlayerRouteInfo[] =
    route.params?.players ??
    Array.from({ length: playerCount }, (_, index) => ({
      id: index + 1,
      name: `${index + 1}. OYUNCU`,
      color: "#00D2FF",
    }));

  const { totalCards } = useMemo(() => {
    const [rowValue, columnValue] = boardSize.split("x").map(Number);
    return { totalCards: rowValue * columnValue };
  }, [boardSize]);

  const boardRows = Math.ceil(totalCards / CARDS_PER_ROW);

  const cardSize = useMemo(() => {
    const horizontalPadding = 18;
    const boardWidth = SCREEN_WIDTH - horizontalPadding * 2;
    const sizeByWidth =
      (boardWidth - GAP * (CARDS_PER_ROW - 1)) / CARDS_PER_ROW;

    const reservedSpace = turnTime === 0 ? 126 : 138;
    const boardHeight = SCREEN_HEIGHT - reservedSpace;
    const sizeByHeight = (boardHeight - GAP * (boardRows - 1)) / boardRows;

    return Math.min(sizeByWidth, sizeByHeight);
  }, [boardRows, turnTime]);

  const createCards = () => {
    const pairCount = totalCards / 2;
    const selectedEmojis = emojis.slice(0, pairCount);

    return [...selectedEmojis, ...selectedEmojis]
      .sort(() => Math.random() - 0.5)
      .map((value, index) => ({
        id: index,
        value,
        isOpen: false,
        isMatched: false,
      }));
  };

  const [cards, setCards] = useState<CardItem[]>(createCards);
  const [openedCards, setOpenedCards] = useState<number[]>([]);
  const [currentPlayer, setCurrentPlayer] = useState(1);
  const [scores, setScores] = useState<number[]>(
    Array.from({ length: playerCount }, () => 0)
  );
  const [isLocked, setIsLocked] = useState(false);
  const [remainingTime, setRemainingTime] = useState(turnTime);

  const activePlayer = players[currentPlayer - 1];

  const changePlayer = () => {
    setCurrentPlayer((prevPlayer) =>
      prevPlayer === playerCount ? 1 : prevPlayer + 1
    );

    if (turnTime !== 0) {
      setRemainingTime(turnTime);
    }
  };

  useEffect(() => {
    if (turnTime === 0) return;

    setRemainingTime(turnTime);

    const interval = setInterval(() => {
      setRemainingTime((prev) => {
        if (prev <= 1) {
          if (!isLocked) {
            changePlayer();
          }

          return turnTime;
        }

        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [currentPlayer, turnTime, isLocked]);

  const finishGame = (finalScores: number[]) => {
    const highestScore = Math.max(...finalScores);

    const winners = finalScores
      .map((score, index) => ({ player: players[index], score }))
      .filter((item) => item.score === highestScore);

    if (winners.length > 1) {
      Alert.alert("Oyun Bitti", "Oyun berabere bitti!");
    } else {
      Alert.alert("Oyun Bitti", `${winners[0].player.name} kazandı!`);
    }
  };

  const checkMatch = (opened: number[], currentCards: CardItem[]) => {
    setIsLocked(true);

    const [firstIndex, secondIndex] = opened;
    const firstCard = currentCards[firstIndex];
    const secondCard = currentCards[secondIndex];

    setTimeout(() => {
      const updatedCards = [...currentCards];

      if (firstCard.value === secondCard.value) {
        updatedCards[firstIndex].isMatched = true;
        updatedCards[secondIndex].isMatched = true;

        const updatedScores = [...scores];
        updatedScores[currentPlayer - 1] += 1;

        setScores(updatedScores);
        setCards(updatedCards);

        if (updatedCards.every((card) => card.isMatched)) {
          finishGame(updatedScores);
        }
      } else {
        updatedCards[firstIndex].isOpen = false;
        updatedCards[secondIndex].isOpen = false;

        setCards(updatedCards);
        changePlayer();
      }

      setOpenedCards([]);
      setIsLocked(false);
    }, 600);
  };

  const handleCardPress = (cardIndex: number) => {
    if (isLocked) return;

    const selectedCard = cards[cardIndex];

    if (selectedCard.isOpen || selectedCard.isMatched) return;
    if (openedCards.length === 2) return;

    const newCards = [...cards];
    newCards[cardIndex].isOpen = true;

    const newOpenedCards = [...openedCards, cardIndex];

    setCards(newCards);
    setOpenedCards(newOpenedCards);

    if (newOpenedCards.length === 2) {
      checkMatch(newOpenedCards, newCards);
    }
  };

  return (
    <LinearGradient
      colors={["#070712", "#101035", "#171753"]}
      style={styles.container}
    >
      <SafeAreaView style={styles.safe}>
        <View style={styles.glowOne} />
        <View style={styles.glowTwo} />

        <View style={styles.topArea}>
          <View style={styles.topLine}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => navigation.goBack()}
              activeOpacity={0.85}
            >
              <Text style={styles.backText}>‹</Text>
            </TouchableOpacity>

            <View
              style={[
                styles.turnPill,
                {
                  borderColor: activePlayer?.color || "#00D2FF",
                  backgroundColor: `${activePlayer?.color || "#00D2FF"}22`,
                },
              ]}
            >
              <Text style={styles.turnLabel}>SIRA</Text>
              <Text
                numberOfLines={1}
                style={[styles.turnText, { color: activePlayer?.color }]}
              >
                {activePlayer?.name}
              </Text>
            </View>

            {turnTime !== 0 ? (
              <View
                style={[
                  styles.timerPill,
                  {
                    borderColor: activePlayer?.color || "#00D2FF",
                    backgroundColor: `${activePlayer?.color || "#00D2FF"}22`,
                  },
                ]}
              >
                <Text style={styles.timerNumber}>{remainingTime}</Text>
                <Text style={[styles.timerLabel, { color: activePlayer?.color }]}>
                  SN
                </Text>
              </View>
            ) : (
              <View style={styles.emptyTimerBox} />
            )}
          </View>

          <View style={styles.scoreContainer}>
            {scores.map((score, index) => {
              const active = currentPlayer === index + 1;
              const player = players[index];

              return (
                <View
                  key={index}
                  style={[
                    styles.scoreBox,
                    { borderColor: player?.color || "rgba(255,255,255,0.15)" },
                    active && {
                      backgroundColor: `${player?.color || "#00D2FF"}33`,
                      borderColor: player?.color || "#00D2FF",
                    },
                  ]}
                >
                  <View
                    style={[
                      styles.colorDot,
                      { backgroundColor: player?.color || "#00D2FF" },
                    ]}
                  />

                  <Text
                    numberOfLines={1}
                    style={[
                      styles.scorePlayer,
                      active && { color: player?.color || "#FFFFFF" },
                    ]}
                  >
                    {player?.name || `${index + 1}. OYUNCU`}
                  </Text>

                  <Text style={styles.scoreText}>{score}</Text>
                </View>
              );
            })}
          </View>
        </View>

        <View style={styles.board}>
          {cards.map((card, index) => {
            const opened = card.isOpen || card.isMatched;

            return (
              <TouchableOpacity
                key={card.id}
                activeOpacity={0.85}
                style={[
                  styles.card,
                  {
                    width: cardSize,
                    height: cardSize,
                    borderRadius: Math.max(9, cardSize * 0.17),
                  },
                  opened ? styles.openCard : styles.closedCard,
                  card.isMatched && styles.matchedCard,
                ]}
                onPress={() => handleCardPress(index)}
              >
                <Text
                  style={[
                    styles.cardText,
                    {
                      fontSize: opened ? cardSize * 0.42 : cardSize * 0.34,
                    },
                  ]}
                >
                  {opened ? card.value : "?"}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  safe: {
    flex: 1,
    paddingHorizontal: 18,
    paddingTop: 6,
    paddingBottom: 6,
  },

  glowOne: {
    position: "absolute",
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: "rgba(108,92,231,0.28)",
    top: -100,
    right: -100,
  },

  glowTwo: {
    position: "absolute",
    width: 190,
    height: 190,
    borderRadius: 95,
    backgroundColor: "rgba(0,210,255,0.14)",
    bottom: 30,
    left: -95,
  },

  topArea: {
    flexShrink: 0,
    marginBottom: 4,
  },

  topLine: {
    height: 42,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
  },

  backButton: {
    width: 36,
    height: 36,
    borderRadius: 14,
    backgroundColor: "rgba(255,255,255,0.08)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.15)",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 7,
  },

  backText: {
    color: "#FFFFFF",
    fontSize: 30,
    fontWeight: "700",
    marginTop: -4,
  },

  turnPill: {
    flex: 1,
    height: 38,
    borderRadius: 15,
    borderWidth: 1.3,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 8,
  },

  turnLabel: {
    color: "#AFAFD1",
    fontSize: 8,
    fontWeight: "900",
    letterSpacing: 1.5,
  },

  turnText: {
    fontSize: 14,
    fontWeight: "900",
    marginTop: 1,
    maxWidth: "100%",
  },

  timerPill: {
    width: 52,
    height: 38,
    borderRadius: 15,
    borderWidth: 1.3,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 7,
  },

  emptyTimerBox: {
    width: 52,
    marginLeft: 7,
  },

  timerNumber: {
    color: "#FFFFFF",
    fontSize: 17,
    fontWeight: "900",
    lineHeight: 18,
  },

  timerLabel: {
    fontSize: 8,
    fontWeight: "900",
    letterSpacing: 0.8,
  },

  scoreContainer: {
    flexDirection: "row",
    gap: 5,
    marginBottom: 2,
  },

  scoreBox: {
    flex: 1,
    height: 46,
    borderRadius: 14,
    backgroundColor: "rgba(255,255,255,0.08)",
    borderWidth: 1.2,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 3,
  },

  colorDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginBottom: 1,
  },

  scorePlayer: {
    color: "#BFC0DD",
    fontSize: 8.5,
    fontWeight: "900",
    maxWidth: "100%",
  },

  scoreText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "900",
    marginTop: -1,
  },

  board: {
    flex: 1,
    flexDirection: "row",
    flexWrap: "wrap",
    gap: GAP,
    justifyContent: "center",
    alignContent: "center",
  },

  card: {
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1.3,
  },

  closedCard: {
    backgroundColor: "rgba(255,255,255,0.08)",
    borderColor: "rgba(255,255,255,0.16)",
  },

  openCard: {
    backgroundColor: "rgba(0,210,255,0.26)",
    borderColor: "#00D2FF",
  },

  matchedCard: {
    backgroundColor: "rgba(34,197,94,0.28)",
    borderColor: "#86EFAC",
  },

  cardText: {
    fontWeight: "900",
    color: "#FFFFFF",
  },
});