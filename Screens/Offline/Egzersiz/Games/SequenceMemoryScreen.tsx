import React, { useEffect, useMemo, useState } from "react";
import {
  Alert,
  Dimensions,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useNavigation } from "@react-navigation/native";

const allCards = [
  "🍎",
  "🚗",
  "⭐",
  "🐶",
  "🍕",
  "⚽",
  "🎧",
  "🔥",
  "🌙",
  "🐱",
  "🍓",
  "🚀",
];

const TOTAL_ROUNDS = 7;
const MEMORIZE_TIME = 5;
const { width } = Dimensions.get("window");

export default function SequenceMemoryScreen() {
  const navigation = useNavigation<any>();

  const [round, setRound] = useState(1);
  const [originalSequence, setOriginalSequence] = useState<string[]>([]);
  const [shuffledCards, setShuffledCards] = useState<string[]>([]);
  const [selectedSequence, setSelectedSequence] = useState<string[]>([]);
  const [isMemorizePhase, setIsMemorizePhase] = useState(true);
  const [timeLeft, setTimeLeft] = useState(MEMORIZE_TIME);

  const cardCount = useMemo(() => round + 3, [round]);
  const cardSize = Math.min(58, (width - 82) / 4);

  const shuffleArray = (array: string[]) => {
    return [...array].sort(() => Math.random() - 0.5);
  };

  const startRound = () => {
    const selectedCards = shuffleArray(allCards).slice(0, cardCount);

    setOriginalSequence(selectedCards);
    setShuffledCards(shuffleArray(selectedCards));
    setSelectedSequence([]);
    setIsMemorizePhase(true);
    setTimeLeft(MEMORIZE_TIME);
  };

  useEffect(() => {
    startRound();
  }, [round]);

  useEffect(() => {
    if (!isMemorizePhase) return;

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setIsMemorizePhase(false);
          return 0;
        }

        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isMemorizePhase]);

  const handleCardPress = (card: string) => {
    if (isMemorizePhase) return;
    if (selectedSequence.includes(card)) return;

    const updatedSequence = [...selectedSequence, card];
    setSelectedSequence(updatedSequence);

    if (updatedSequence.length === cardCount) {
      checkAnswer(updatedSequence);
    }
  };

  const undoSelection = () => {
    if (isMemorizePhase) return;
    setSelectedSequence((prev) => prev.slice(0, -1));
  };

  const checkAnswer = (userSequence: string[]) => {
    const isCorrect =
      JSON.stringify(userSequence) === JSON.stringify(originalSequence);

    setTimeout(() => {
      if (isCorrect) {
        if (round === TOTAL_ROUNDS) {
          Alert.alert("Tebrikler", "Tüm etapları tamamladın!", [
            {
              text: "Başa Dön",
              onPress: () => setRound(1),
            },
          ]);
        } else {
          Alert.alert("Doğru", "Sonraki etaba geçiyorsun.", [
            {
              text: "Devam",
              onPress: () => setRound((prev) => prev + 1),
            },
          ]);
        }
      } else {
        Alert.alert(
          "Yanlış Sıra",
          `Doğru sıra: ${originalSequence.join(" ")}`,
          [
            {
              text: "Tekrar Dene",
              onPress: () => startRound(),
            },
          ]
        );
      }
    }, 250);
  };

  const progressText = `${selectedSequence.length}/${cardCount}`;

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
          <Text style={styles.subLogo}>SIRA HAFIZASI</Text>
        </View>

        <View style={styles.topPanel}>
          <View style={styles.statBox}>
            <Text style={styles.statLabel}>ETAP</Text>
            <Text style={styles.statValue}>{round}/{TOTAL_ROUNDS}</Text>
          </View>

          <View style={styles.mainStatusBox}>
            <Text style={styles.statusTitle}>
              {isMemorizePhase ? "SIRAYI EZBERLE" : "AYNI SIRAYLA SEÇ"}
            </Text>
            <Text style={styles.statusDesc}>
              {isMemorizePhase
                ? `${timeLeft} saniye içinde kartların sırasını aklında tut.`
                : "Aşağıdaki kartlara ezberlediğin sırayla dokun."}
            </Text>
          </View>

          <View style={styles.statBox}>
            <Text style={styles.statLabel}>KART</Text>
            <Text style={styles.statValue}>{cardCount}</Text>
          </View>
        </View>

        <View style={styles.gameArea}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>
              {isMemorizePhase ? "Ezberlenecek Sıra" : "Senin Sıran"}
            </Text>

            {!isMemorizePhase && (
              <Text style={styles.progressText}>{progressText}</Text>
            )}
          </View>

          <View style={styles.sequenceBox}>
            {isMemorizePhase ? (
              originalSequence.map((card, index) => (
                <View
                  key={`${card}-${index}`}
                  style={[
                    styles.memoryCard,
                    {
                      width: cardSize,
                      height: cardSize,
                      borderRadius: cardSize * 0.24,
                    },
                  ]}
                >
                  <Text style={styles.cardText}>{card}</Text>
                </View>
              ))
            ) : selectedSequence.length > 0 ? (
              selectedSequence.map((card, index) => (
                <View
                  key={`${card}-${index}`}
                  style={[
                    styles.selectedCard,
                    {
                      width: cardSize,
                      height: cardSize,
                      borderRadius: cardSize * 0.24,
                    },
                  ]}
                >
                  <Text style={styles.cardText}>{card}</Text>
                </View>
              ))
            ) : (
              <Text style={styles.emptyText}>Henüz kart seçmedin.</Text>
            )}
          </View>

          {!isMemorizePhase && (
            <>
              <View style={styles.actionRow}>
                <TouchableOpacity
                  style={[
                    styles.undoButton,
                    selectedSequence.length === 0 && styles.disabledButton,
                  ]}
                  disabled={selectedSequence.length === 0}
                  onPress={undoSelection}
                >
                  <Text style={styles.undoText}>⌫ Geri Al</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.retryButton} onPress={startRound}>
                  <Text style={styles.retryText}>↻ Tekrar Göster</Text>
                </TouchableOpacity>
              </View>

              <Text style={styles.sectionTitle}>Kartlar</Text>

              <View style={styles.choiceArea}>
                {shuffledCards.map((card, index) => {
                  const isSelected = selectedSequence.includes(card);

                  return (
                    <TouchableOpacity
                      key={`${card}-${index}`}
                      disabled={isSelected}
                      activeOpacity={0.85}
                      onPress={() => handleCardPress(card)}
                      style={[
                        styles.choiceCard,
                        {
                          width: cardSize,
                          height: cardSize,
                          borderRadius: cardSize * 0.24,
                        },
                        isSelected && styles.disabledCard,
                      ]}
                    >
                      <Text style={styles.cardText}>{card}</Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </>
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
    paddingHorizontal: 18,
    paddingTop: 12,
    paddingBottom: 14,
  },

  glowOne: {
    position: "absolute",
    width: 240,
    height: 240,
    borderRadius: 120,
    backgroundColor: "rgba(108,92,231,0.30)",
    top: -100,
    right: -105,
  },

  glowTwo: {
    position: "absolute",
    width: 210,
    height: 210,
    borderRadius: 105,
    backgroundColor: "rgba(0,210,255,0.15)",
    bottom: 60,
    left: -105,
  },

  header: {
    alignItems: "center",
    marginTop: 4,
    marginBottom: 12,
  },

  backButton: {
    position: "absolute",
    left: 0,
    top: 0,
    width: 38,
    height: 38,
    borderRadius: 15,
    backgroundColor: "rgba(255,255,255,0.08)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.15)",
    alignItems: "center",
    justifyContent: "center",
  },

  backText: {
    color: "#FFFFFF",
    fontSize: 31,
    fontWeight: "700",
    marginTop: -4,
  },

  logo: {
    fontSize: 34,
    fontWeight: "900",
    color: "#FFFFFF",
    letterSpacing: 3,
  },

  subLogo: {
    marginTop: 4,
    color: "#00D2FF",
    fontSize: 11,
    fontWeight: "900",
    letterSpacing: 2,
  },

  topPanel: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 12,
  },

  statBox: {
    width: 62,
    height: 66,
    borderRadius: 18,
    backgroundColor: "rgba(255,255,255,0.08)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.15)",
    alignItems: "center",
    justifyContent: "center",
  },

  statLabel: {
    color: "#AFAFD1",
    fontSize: 9,
    fontWeight: "900",
  },

  statValue: {
    color: "#FFFFFF",
    fontSize: 17,
    fontWeight: "900",
    marginTop: 2,
  },

  mainStatusBox: {
    flex: 1,
    minHeight: 66,
    borderRadius: 18,
    backgroundColor: "rgba(0,210,255,0.12)",
    borderWidth: 1,
    borderColor: "rgba(0,210,255,0.28)",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 10,
  },

  statusTitle: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "900",
    textAlign: "center",
  },

  statusDesc: {
    color: "#D8D8F0",
    fontSize: 11,
    fontWeight: "700",
    textAlign: "center",
    marginTop: 3,
    lineHeight: 15,
  },

  gameArea: {
    flex: 1,
    justifyContent: "center",
  },

  sectionHeader: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 7,
  },

  sectionTitle: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "900",
    textAlign: "center",
    marginBottom: 7,
  },

  progressText: {
    position: "absolute",
    right: 0,
    color: "#00D2FF",
    fontSize: 13,
    fontWeight: "900",
  },

  sequenceBox: {
    minHeight: 116,
    borderRadius: 22,
    padding: 10,
    flexDirection: "row",
    justifyContent: "center",
    flexWrap: "wrap",
    gap: 8,
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.07)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.14)",
    marginBottom: 12,
  },

  memoryCard: {
    backgroundColor: "rgba(0,210,255,0.26)",
    borderWidth: 1,
    borderColor: "#00D2FF",
    alignItems: "center",
    justifyContent: "center",
  },

  selectedCard: {
    backgroundColor: "rgba(34,197,94,0.28)",
    borderWidth: 1,
    borderColor: "#86EFAC",
    alignItems: "center",
    justifyContent: "center",
  },

  emptyText: {
    color: "#8E8EAE",
    fontSize: 14,
    fontWeight: "800",
    textAlign: "center",
  },

  actionRow: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 12,
  },

  undoButton: {
    flex: 1,
    height: 42,
    borderRadius: 16,
    backgroundColor: "rgba(239,68,68,0.18)",
    borderWidth: 1,
    borderColor: "rgba(239,68,68,0.45)",
    alignItems: "center",
    justifyContent: "center",
  },

  retryButton: {
    flex: 1,
    height: 42,
    borderRadius: 16,
    backgroundColor: "rgba(0,210,255,0.13)",
    borderWidth: 1,
    borderColor: "rgba(0,210,255,0.32)",
    alignItems: "center",
    justifyContent: "center",
  },

  disabledButton: {
    opacity: 0.35,
  },

  undoText: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "900",
  },

  retryText: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "900",
  },

  choiceArea: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: 8,
  },

  choiceCard: {
    backgroundColor: "rgba(255,255,255,0.08)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.16)",
    alignItems: "center",
    justifyContent: "center",
  },

  disabledCard: {
    opacity: 0.25,
  },

  cardText: {
    fontSize: 26,
  },
});