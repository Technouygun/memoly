import { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Alert,
} from "react-native";
import { useNavigation } from "@react-navigation/native";

const TOTAL_ROUNDS = 7;
const START_CARD_COUNT = 4;

export default function FlashMemoryScreen() {
  const navigation = useNavigation<any>();

  const [round, setRound] = useState(1);
  const [sequence, setSequence] = useState<number[]>([]);
  const [playerSequence, setPlayerSequence] = useState<number[]>([]);
  const [activeCard, setActiveCard] = useState<number | null>(null);
  const [gameStatus, setGameStatus] = useState<"waiting" | "showing" | "playing">(
    "waiting"
  );

  const cardCount = START_CARD_COUNT + round - 1;
  const cards = Array.from({ length: cardCount }, (_, index) => index);

  const sleep = (ms: number) =>
    new Promise<void>((resolve) => setTimeout(resolve, ms));

  const createRandomSequence = () => {
    const newSequence: number[] = [];

    for (let i = 0; i < cardCount; i++) {
      const randomIndex = Math.floor(Math.random() * cardCount);
      newSequence.push(randomIndex);
    }

    return newSequence;
  };

  const startRound = async () => {
    const newSequence = createRandomSequence();

    setSequence(newSequence);
    setPlayerSequence([]);
    setGameStatus("showing");

    await sleep(500);

    for (const cardIndex of newSequence) {
      setActiveCard(cardIndex);
      await sleep(500);
      setActiveCard(null);
      await sleep(350);
    }

    setGameStatus("playing");
  };

  const handleCardPress = async (index: number) => {
    if (gameStatus !== "playing") return;

    setActiveCard(index);
    await sleep(180);
    setActiveCard(null);

    const newPlayerSequence = [...playerSequence, index];
    setPlayerSequence(newPlayerSequence);

    const currentIndex = newPlayerSequence.length - 1;

 if (newPlayerSequence[currentIndex] !== sequence[currentIndex]) {
  Alert.alert("Yanlış Sıra", "Aynı turdan tekrar dene.");

  setPlayerSequence([]);
  setSequence([]);
  setActiveCard(null);
  setGameStatus("waiting");

  return;
}
    if (newPlayerSequence.length === sequence.length) {
      if (round === TOTAL_ROUNDS) {
        Alert.alert("Tebrikler!", "Tüm turları başarıyla tamamladın.");
        resetGame();
      } else {
        Alert.alert("Doğru!", "Sonraki tura geçiyorsun.");
        setRound((prev) => prev + 1);
        setPlayerSequence([]);
        setSequence([]);
        setGameStatus("waiting");
      }
    }
  };

  const resetGame = () => {
    setRound(1);
    setSequence([]);
    setPlayerSequence([]);
    setActiveCard(null);
    setGameStatus("waiting");
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Görsel Hafıza Egzersizi</Text>
        <Text style={styles.roundText}>
          Tur {round} / {TOTAL_ROUNDS}
        </Text>
        <Text style={styles.cardCountText}>{cardCount} Kart</Text>
      </View>

      <View style={styles.grid}>
        {cards.map((card) => (
          <TouchableOpacity
            key={card}
            activeOpacity={0.8}
            style={[
              styles.card,
              activeCard === card && styles.activeCard,
            ]}
            onPress={() => handleCardPress(card)}
          >
            <Text style={styles.cardText}>{card + 1}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.footer}>
        {gameStatus === "waiting" && (
          <TouchableOpacity style={styles.startButton} onPress={startRound}>
            <Text style={styles.startButtonText}>Başla</Text>
          </TouchableOpacity>
        )}

        {gameStatus === "showing" && (
          <Text style={styles.infoText}>Sırayı ezberle...</Text>
        )}

        {gameStatus === "playing" && (
          <Text style={styles.infoText}>Aynı sırayla kartlara bas</Text>
        )}

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
    backgroundColor: "#111827",
    paddingHorizontal: 20,
  },

  header: {
    alignItems: "center",
    paddingTop: 30,
    marginBottom: 24,
  },

  title: {
    fontSize: 28,
    fontWeight: "800",
    color: "#F9FAFB",
    textAlign: "center",
  },

  roundText: {
    marginTop: 12,
    fontSize: 18,
    fontWeight: "700",
    color: "#60A5FA",
  },

  cardCountText: {
    marginTop: 4,
    fontSize: 15,
    color: "#D1D5DB",
  },

  grid: {
    flex: 1,
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    alignContent: "center",
    gap: 12,
  },

  card: {
    width: 82,
    height: 82,
    borderRadius: 18,
    backgroundColor: "#1F2937",
    borderWidth: 2,
    borderColor: "#374151",
    alignItems: "center",
    justifyContent: "center",
  },

  activeCard: {
    backgroundColor: "#2563EB",
    borderColor: "#93C5FD",
    transform: [{ scale: 1.08 }],
  },

  cardText: {
    fontSize: 24,
    fontWeight: "800",
    color: "#FFFFFF",
  },

  footer: {
    paddingBottom: 30,
    alignItems: "center",
  },

  startButton: {
    width: "100%",
    backgroundColor: "#2563EB",
    paddingVertical: 17,
    borderRadius: 18,
    alignItems: "center",
    marginBottom: 14,
  },

  startButtonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "800",
  },

  infoText: {
    color: "#F9FAFB",
    fontSize: 17,
    fontWeight: "700",
    marginBottom: 18,
  },

  backButton: {
    width: "100%",
    backgroundColor: "#374151",
    paddingVertical: 15,
    borderRadius: 16,
    alignItems: "center",
  },

  backButtonText: {
    color: "#F9FAFB",
    fontSize: 16,
    fontWeight: "700",
  },
});