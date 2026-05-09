import React, { useMemo, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Alert,
} from "react-native";
import { useNavigation } from "@react-navigation/native";

type BoardSize = "4x4" | "4x5" | "4x6" | "5x6";
type PlayerCount = 2 | 3 | 4;

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
  "⚽",
];

export default function GameScreen() {
  const navigation = useNavigation<any>();

  const boardSize: BoardSize = "4x4";
  const playerCount: PlayerCount = 2;

  const { column, totalCards } = useMemo(() => {
    const [rowValue, columnValue] = boardSize.split("x").map(Number);

    return {
      row: rowValue,
      column: columnValue,
      totalCards: rowValue * columnValue,
    };
  }, [boardSize]);

  const createCards = () => {
    const pairCount = totalCards / 2;
    const selectedEmojis = emojis.slice(0, pairCount);

    const cards: CardItem[] = [...selectedEmojis, ...selectedEmojis]
      .sort(() => Math.random() - 0.5)
      .map((value, index) => ({
        id: index,
        value,
        isOpen: false,
        isMatched: false,
      }));

    return cards;
  };

  const [cards, setCards] = useState<CardItem[]>(createCards);
  const [openedCards, setOpenedCards] = useState<number[]>([]);
  const [currentPlayer, setCurrentPlayer] = useState(1);
  const [scores, setScores] = useState<number[]>(
    Array.from({ length: playerCount }, () => 0)
  );
  const [isLocked, setIsLocked] = useState(false);

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

        const isGameFinished = updatedCards.every((card) => card.isMatched);

        if (isGameFinished) {
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
    }, 800);
  };

  const changePlayer = () => {
    setCurrentPlayer((prevPlayer) => {
      if (prevPlayer === playerCount) {
        return 1;
      }

      return prevPlayer + 1;
    });
  };

  const finishGame = (finalScores: number[]) => {
    const highestScore = Math.max(...finalScores);

    const winners = finalScores
      .map((score, index) => ({
        player: index + 1,
        score,
      }))
      .filter((item) => item.score === highestScore);

    if (winners.length > 1) {
      Alert.alert("Oyun Bitti", "Oyun berabere bitti!");
    } else {
      Alert.alert("Oyun Bitti", `${winners[0].player}. Oyuncu kazandı!`);
    }
  };

  const restartGame = () => {
    setCards(createCards());
    setOpenedCards([]);
    setCurrentPlayer(1);
    setScores(Array.from({ length: playerCount }, () => 0));
    setIsLocked(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Hafıza Oyunu</Text>

      <View style={styles.infoBox}>
        <Text style={styles.infoText}>Düzen: {boardSize}</Text>
        <Text style={styles.infoText}>Oyuncu: {playerCount}</Text>
      </View>

      <Text style={styles.turnText}>Sıra: {currentPlayer}. Oyuncu</Text>

      <View style={styles.scoreContainer}>
        {scores.map((score, index) => (
          <View
            key={index}
            style={[
              styles.scoreBox,
              currentPlayer === index + 1 && styles.activeScoreBox,
            ]}
          >
            <Text style={styles.scoreTitle}>{index + 1}. Oyuncu</Text>
            <Text style={styles.scoreText}>{score}</Text>
          </View>
        ))}
      </View>

      <View style={styles.board}>
        {cards.map((card, index) => (
          <TouchableOpacity
            key={card.id}
            style={[
              styles.card,
              {
                width: `${100 / column - 2}%`,
                aspectRatio: 1,
              },
              card.isOpen || card.isMatched
                ? styles.openCard
                : styles.closedCard,
            ]}
            onPress={() => handleCardPress(index)}
          >
            <Text style={styles.cardText}>
              {card.isOpen || card.isMatched ? card.value : "?"}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.bottomButtons}>
        <TouchableOpacity style={styles.restartButton} onPress={restartGame}>
          <Text style={styles.buttonText}>Yeniden Başlat</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonText}>Geri Dön</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#101827",
    padding: 16,
  },

  title: {
    fontSize: 28,
    fontWeight: "900",
    color: "#FFFFFF",
    textAlign: "center",
    marginTop: 10,
    marginBottom: 12,
  },

  infoBox: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#1F2937",
    padding: 12,
    borderRadius: 14,
    marginBottom: 12,
  },

  infoText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
  },

  turnText: {
    color: "#FACC15",
    fontSize: 20,
    fontWeight: "900",
    textAlign: "center",
    marginBottom: 12,
  },

  scoreContainer: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 16,
  },

  scoreBox: {
    flex: 1,
    backgroundColor: "#1F2937",
    paddingVertical: 10,
    borderRadius: 14,
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#374151",
  },

  activeScoreBox: {
    borderColor: "#FACC15",
    backgroundColor: "#334155",
  },

  scoreTitle: {
    color: "#D1D5DB",
    fontSize: 13,
    fontWeight: "700",
  },

  scoreText: {
    color: "#FFFFFF",
    fontSize: 22,
    fontWeight: "900",
  },

  board: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: 6,
    flex: 1,
  },

  card: {
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },

  closedCard: {
    backgroundColor: "#374151",
  },

  openCard: {
    backgroundColor: "#22C55E",
  },

  cardText: {
    fontSize: 28,
    fontWeight: "900",
    color: "#FFFFFF",
  },

  bottomButtons: {
    gap: 10,
    marginTop: 12,
  },

  restartButton: {
    backgroundColor: "#FACC15",
    paddingVertical: 15,
    borderRadius: 16,
    alignItems: "center",
  },

  backButton: {
    backgroundColor: "#374151",
    paddingVertical: 15,
    borderRadius: 16,
    alignItems: "center",
  },

  buttonText: {
    color: "#111827",
    fontSize: 17,
    fontWeight: "900",
  },

  backButtonText: {
    color: "#FFFFFF",
    fontSize: 17,
    fontWeight: "900",
  },
});