import { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Alert,
  Dimensions,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useNavigation } from "@react-navigation/native";
import { useLanguage } from "../../../../Screens/language/LanguageContext";

const TOTAL_ROUNDS = 7;
const START_CARD_COUNT = 4;
const { width } = Dimensions.get("window");

export default function FlashMemoryScreen() {
  const navigation = useNavigation<any>();
  const { t } = useLanguage();

  const [round, setRound] = useState(1);
  const [sequence, setSequence] = useState<number[]>([]);
  const [playerSequence, setPlayerSequence] = useState<number[]>([]);
  const [activeCard, setActiveCard] = useState<number | null>(null);
  const [gameStatus, setGameStatus] = useState<"waiting" | "showing" | "playing">(
    "waiting"
  );

  const cardCount = START_CARD_COUNT + round - 1;
  const cards = Array.from({ length: cardCount }, (_, index) => index);

  const cardSize = Math.min(78, (width - 72) / 4);

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
      await sleep(320);
    }

    setGameStatus("playing");
  };

  const handleCardPress = async (index: number) => {
    if (gameStatus !== "playing") return;

    setActiveCard(index);
    await sleep(160);
    setActiveCard(null);

    const newPlayerSequence = [...playerSequence, index];
    setPlayerSequence(newPlayerSequence);

    const currentIndex = newPlayerSequence.length - 1;

    if (newPlayerSequence[currentIndex] !== sequence[currentIndex]) {
      Alert.alert(t.wrongOrderTitle, t.wrongOrderMessage);

      setPlayerSequence([]);
      setSequence([]);
      setActiveCard(null);
      setGameStatus("waiting");
      return;
    }

    if (newPlayerSequence.length === sequence.length) {
      if (round === TOTAL_ROUNDS) {
        Alert.alert(t.congrats, t.allRoundsCompleted);
        resetGame();
      } else {
        Alert.alert(t.correct, t.nextRound);
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
    <LinearGradient colors={["#070712", "#101035", "#171753"]} style={styles.container}>
      <SafeAreaView style={styles.safe}>
        <View style={styles.glowOne} />
        <View style={styles.glowTwo} />

        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <Text style={styles.backText}>‹</Text>
          </TouchableOpacity>

          <Text style={styles.logo}>MEMOLY</Text>
          <Text style={styles.subLogo}>FLASH MEMORY</Text>
        </View>

        <View style={styles.infoPanel}>
          <Text style={styles.title}>{t.flashMemoryExercise}</Text>

          <View style={styles.statsRow}>
            <View style={styles.statBox}>
              <Text style={styles.statLabel}>{t.round}</Text>
              <Text style={styles.statValue}>{round}/{TOTAL_ROUNDS}</Text>
            </View>

            <View style={styles.statBox}>
              <Text style={styles.statLabel}>{t.cards}</Text>
              <Text style={styles.statValue}>{cardCount}</Text>
            </View>
          </View>
        </View>

        <View style={styles.grid}>
          {cards.map((card) => (
            <TouchableOpacity
              key={card}
              activeOpacity={0.85}
              style={[
                styles.card,
                {
                  width: cardSize,
                  height: cardSize,
                  borderRadius: cardSize * 0.22,
                },
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
              <LinearGradient
                colors={["#8E7CFF", "#6C5CE7", "#00D2FF"]}
                style={styles.startGradient}
              >
                <Text style={styles.startButtonText}>{t.start}</Text>
              </LinearGradient>
            </TouchableOpacity>
          )}

          {gameStatus === "showing" && (
            <Text style={styles.infoText}>⚡ {t.memorizeOrder}</Text>
          )}

          {gameStatus === "playing" && (
            <Text style={styles.infoText}>🎯 {t.pressSameOrder}</Text>
          )}
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },

  safe: {
    flex: 1,
    paddingHorizontal: 22,
    paddingTop: 16,
    paddingBottom: 22,
  },

  glowOne: {
    position: "absolute",
    width: 260,
    height: 260,
    borderRadius: 130,
    backgroundColor: "rgba(108,92,231,0.32)",
    top: -100,
    right: -105,
  },

  glowTwo: {
    position: "absolute",
    width: 230,
    height: 230,
    borderRadius: 115,
    backgroundColor: "rgba(0,210,255,0.17)",
    bottom: 80,
    left: -105,
  },

  header: {
    alignItems: "center",
    marginTop: 8,
    marginBottom: 18,
  },

  backButton: {
    position: "absolute",
    left: 0,
    top: 0,
    width: 42,
    height: 42,
    borderRadius: 16,
    backgroundColor: "rgba(255,255,255,0.08)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.15)",
    alignItems: "center",
    justifyContent: "center",
  },

  backText: {
    color: "#FFFFFF",
    fontSize: 34,
    fontWeight: "700",
    marginTop: -4,
  },

  logo: {
    fontSize: 36,
    fontWeight: "900",
    color: "#FFFFFF",
    letterSpacing: 3,
  },

  subLogo: {
    marginTop: 5,
    color: "#00D2FF",
    fontSize: 12,
    fontWeight: "900",
    letterSpacing: 2,
  },

  infoPanel: {
    padding: 16,
    borderRadius: 24,
    backgroundColor: "rgba(255,255,255,0.08)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.16)",
  },

  title: {
    fontSize: 25,
    fontWeight: "900",
    color: "#FFFFFF",
    textAlign: "center",
    marginBottom: 14,
  },

  statsRow: {
    flexDirection: "row",
    gap: 10,
  },

  statBox: {
    flex: 1,
    height: 58,
    borderRadius: 18,
    backgroundColor: "rgba(0,210,255,0.12)",
    borderWidth: 1,
    borderColor: "rgba(0,210,255,0.25)",
    alignItems: "center",
    justifyContent: "center",
  },

  statLabel: {
    color: "#AFAFD1",
    fontSize: 11,
    fontWeight: "900",
  },

  statValue: {
    color: "#FFFFFF",
    fontSize: 20,
    fontWeight: "900",
    marginTop: 2,
  },

  grid: {
    flex: 1,
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    alignContent: "center",
    gap: 10,
  },

  card: {
    backgroundColor: "rgba(255,255,255,0.08)",
    borderWidth: 1.4,
    borderColor: "rgba(255,255,255,0.16)",
    alignItems: "center",
    justifyContent: "center",
  },

  activeCard: {
    backgroundColor: "rgba(0,210,255,0.30)",
    borderColor: "#00D2FF",
    transform: [{ scale: 1.06 }],
  },

  cardText: {
    fontSize: 24,
    fontWeight: "900",
    color: "#FFFFFF",
  },

  footer: {
    minHeight: 66,
    justifyContent: "center",
    alignItems: "center",
  },

  startButton: {
    width: "100%",
    borderRadius: 22,
    overflow: "hidden",
  },

  startGradient: {
    paddingVertical: 17,
    alignItems: "center",
  },

  startButtonText: {
    color: "#FFFFFF",
    fontSize: 20,
    fontWeight: "900",
  },

  infoText: {
    color: "#FFFFFF",
    fontSize: 17,
    fontWeight: "900",
    textAlign: "center",
  },
});