import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
} from "react-native";

type BoardSize = "4x4" | "4x5" | "4x6" | "5x6";
type PlayerCount = 2 | 3 | 4;

type Props = {
  onBack: () => void;
  onStartGame: (boardSize: BoardSize, playerCount: PlayerCount) => void;
};

export default function LocalMultiplayerScreen({ onBack, onStartGame }: Props) {
  const [selectedBoard, setSelectedBoard] = useState<BoardSize | null>(null);
  const [selectedPlayers, setSelectedPlayers] = useState<PlayerCount | null>(
    null
  );

  const boardOptions: BoardSize[] = ["4x4", "4x5", "4x6", "5x6"];
  const playerOptions: PlayerCount[] = [2, 3, 4];

  const canStart = selectedBoard !== null && selectedPlayers !== null;

  const handleStart = () => {
    if (!selectedBoard || !selectedPlayers) return;
    onStartGame(selectedBoard, selectedPlayers);
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Tek Telefon Çok Kişi</Text>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Kart Düzeni Seç</Text>

        <View style={styles.options}>
          {boardOptions.map((item) => (
            <TouchableOpacity
              key={item}
              style={[
                styles.optionButton,
                selectedBoard === item && styles.selectedButton,
              ]}
              onPress={() => setSelectedBoard(item)}
            >
              <Text
                style={[
                  styles.optionText,
                  selectedBoard === item && styles.selectedText,
                ]}
              >
                {item}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Oyuncu Sayısı Seç</Text>

        <View style={styles.options}>
          {playerOptions.map((item) => (
            <TouchableOpacity
              key={item}
              style={[
                styles.optionButton,
                selectedPlayers === item && styles.selectedButton,
              ]}
              onPress={() => setSelectedPlayers(item)}
            >
              <Text
                style={[
                  styles.optionText,
                  selectedPlayers === item && styles.selectedText,
                ]}
              >
                {item} Kişi
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {canStart && (
        <TouchableOpacity style={styles.playButton} onPress={handleStart}>
          <Text style={styles.playButtonText}>Oyna</Text>
        </TouchableOpacity>
      )}

      <View style={styles.bottomArea}>
        <TouchableOpacity style={styles.homeButton} onPress={onBack}>
          <Text style={styles.homeButtonText}>Anasayfa</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#101827",
    padding: 20,
  },

  title: {
    fontSize: 30,
    fontWeight: "800",
    color: "#FFFFFF",
    textAlign: "center",
    marginTop: 25,
    marginBottom: 35,
  },

  section: {
    marginBottom: 35,
  },

  sectionTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#FFFFFF",
    marginBottom: 15,
  },

  options: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },

  optionButton: {
    width: "47%",
    backgroundColor: "#1F2937",
    paddingVertical: 18,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: "#374151",
    alignItems: "center",
  },

  selectedButton: {
    backgroundColor: "#22C55E",
    borderColor: "#86EFAC",
  },

  optionText: {
    color: "#D1D5DB",
    fontSize: 18,
    fontWeight: "700",
  },

  selectedText: {
    color: "#FFFFFF",
  },

  playButton: {
    backgroundColor: "#FACC15",
    paddingVertical: 18,
    borderRadius: 18,
    alignItems: "center",
    marginTop: 10,
  },

  playButtonText: {
    color: "#111827",
    fontSize: 22,
    fontWeight: "900",
  },

  bottomArea: {
    marginTop: "auto",
  },

  homeButton: {
    backgroundColor: "#374151",
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: "center",
  },

  homeButtonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "700",
  },
});