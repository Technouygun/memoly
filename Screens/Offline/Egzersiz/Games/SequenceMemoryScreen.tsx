import React, { useEffect, useMemo, useState } from "react";
import {
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Alert,
  ScrollView,
} from "react-native";
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

export default function SequenceMemoryScreen() {
  const navigation = useNavigation<any>();

  const [originalSequence, setOriginalSequence] = useState<string[]>([]);
  const [shuffledCards, setShuffledCards] = useState<string[]>([]);
  const [selectedSequence, setSelectedSequence] = useState<string[]>([]);
  const [isMemorizePhase, setIsMemorizePhase] = useState(true);
  const [round, setRound] = useState(1);

  const cardCount = useMemo(() => {
    return round + 3;
  }, [round]);

  const shuffleArray = (array: string[]) => {
    return [...array].sort(() => Math.random() - 0.5);
  };

  const startRound = () => {
    const selectedCards = shuffleArray(allCards).slice(0, cardCount);

    setOriginalSequence(selectedCards);
    setShuffledCards(shuffleArray(selectedCards));
    setSelectedSequence([]);
    setIsMemorizePhase(true);

    setTimeout(() => {
      setIsMemorizePhase(false);
    }, 5000);
  };

  useEffect(() => {
    startRound();
  }, [round]);

  const handleCardPress = (card: string) => {
    if (isMemorizePhase) return;
    if (selectedSequence.includes(card)) return;
    if (selectedSequence.length >= cardCount) return;

    const updatedSequence = [...selectedSequence, card];

    setSelectedSequence(updatedSequence);

    if (updatedSequence.length === cardCount) {
      checkAnswer(updatedSequence);
    }
  };

  const checkAnswer = (userSequence: string[]) => {
    const isCorrect =
      JSON.stringify(userSequence) === JSON.stringify(originalSequence);

    setTimeout(() => {
      if (isCorrect) {
        if (round === TOTAL_ROUNDS) {
          Alert.alert("Tebrikler!", "Tüm turları başarıyla tamamladın.", [
            {
              text: "Başa Dön",
              onPress: () => {
                setRound(1);
              },
            },
          ]);
        } else {
          Alert.alert("Doğru!", "Bir sonraki tura geçiliyor.", [
            {
              text: "Devam Et",
              onPress: () => setRound((prev) => prev + 1),
            },
          ]);
        }
      } else {
        Alert.alert("Yanlış!", `Doğru sıra: ${originalSequence.join(" ")}`, [
          {
            text: "Tekrar Dene",
            onPress: () => startRound(),
          },
        ]);
      }
    }, 300);
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Sıralı Hafıza Egzersizi</Text>

      <Text style={styles.roundText}>
        Tur: {round}/{TOTAL_ROUNDS}
      </Text>

      <Text style={styles.infoText}>
        {isMemorizePhase
          ? `${cardCount} kartın sırasını ezberle`
          : "Aynı sırayı tekrar oluştur"}
      </Text>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.topArea}>
          {isMemorizePhase ? (
            originalSequence.map((card, index) => (
              <View key={index} style={styles.memoryCard}>
                <Text style={styles.cardText}>{card}</Text>
              </View>
            ))
          ) : (
            <View style={styles.hiddenArea}>
              <Text style={styles.hiddenText}>Kartlar Gizlendi</Text>
            </View>
          )}
        </View>

        <Text style={styles.smallTitle}>Seçtiğin Sıra</Text>

        <View style={styles.selectedArea}>
          {selectedSequence.length === 0 ? (
            <Text style={styles.emptyText}>Kartlara sırayla dokun</Text>
          ) : (
            selectedSequence.map((card, index) => (
              <View key={index} style={styles.selectedCard}>
                <Text style={styles.cardText}>{card}</Text>
              </View>
            ))
          )}
        </View>

        {!isMemorizePhase && (
          <>
            <Text style={styles.smallTitle}>Kartlar</Text>

            <View style={styles.bottomArea}>
              {shuffledCards.map((card, index) => {
                const isSelected = selectedSequence.includes(card);

                return (
                  <TouchableOpacity
                    key={index}
                    style={[
                      styles.choiceCard,
                      isSelected && styles.disabledCard,
                    ]}
                    disabled={isSelected}
                    onPress={() => handleCardPress(card)}
                  >
                    <Text style={styles.cardText}>{card}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </>
        )}
      </ScrollView>

      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <Text style={styles.backButtonText}>Geri Dön</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0F172A",
    padding: 20,
  },

  scrollContent: {
    paddingBottom: 20,
  },

  title: {
    fontSize: 26,
    fontWeight: "900",
    color: "#FFFFFF",
    textAlign: "center",
    marginTop: 16,
  },

  roundText: {
    color: "#FACC15",
    fontSize: 20,
    fontWeight: "800",
    textAlign: "center",
    marginTop: 10,
  },

  infoText: {
    color: "#CBD5E1",
    fontSize: 16,
    textAlign: "center",
    marginTop: 14,
    marginBottom: 24,
  },

  topArea: {
    flexDirection: "row",
    justifyContent: "center",
    flexWrap: "wrap",
    gap: 10,
    marginBottom: 30,
  },

  memoryCard: {
    width: 64,
    height: 64,
    backgroundColor: "#2563EB",
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },

  hiddenArea: {
    width: "100%",
    height: 80,
    borderRadius: 18,
    backgroundColor: "#1E293B",
    alignItems: "center",
    justifyContent: "center",
  },

  hiddenText: {
    color: "#94A3B8",
    fontSize: 18,
    fontWeight: "700",
  },

  smallTitle: {
    color: "#FFFFFF",
    fontSize: 17,
    fontWeight: "800",
    marginBottom: 12,
    textAlign: "center",
  },

  selectedArea: {
    minHeight: 80,
    backgroundColor: "#111827",
    borderRadius: 18,
    padding: 12,
    flexDirection: "row",
    justifyContent: "center",
    flexWrap: "wrap",
    gap: 10,
    marginBottom: 28,
    alignItems: "center",
  },

  selectedCard: {
    width: 56,
    height: 56,
    backgroundColor: "#22C55E",
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },

  emptyText: {
    color: "#64748B",
    fontSize: 15,
    fontWeight: "700",
  },

  bottomArea: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: 12,
  },

  choiceCard: {
    width: 64,
    height: 64,
    backgroundColor: "#334155",
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },

  disabledCard: {
    opacity: 0.35,
  },

  cardText: {
    fontSize: 30,
  },

  backButton: {
    backgroundColor: "#374151",
    paddingVertical: 16,
    borderRadius: 18,
    alignItems: "center",
  },

  backButtonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "800",
  },
});