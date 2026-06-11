import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  TextInput,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useNavigation } from "@react-navigation/native";
import { useLanguage } from "../../language/LanguageContext";

type BoardSize = "4x4" | "4x5" | "4x6" | "4x7";
type PlayerCount = 2 | 3 | 4;
type TurnTime = 7 | 14 | 0;

type PlayerInfo = {
  name: string;
  color: string;
};

type PlayerColor = {
  name: "Sarı" | "Mavi" | "Kırmızı" | "Turuncu";
  value: string;
};

const colorOptions: PlayerColor[] = [
  { name: "Sarı", value: "#FACC15" },
  { name: "Mavi", value: "#38BDF8" },
  { name: "Kırmızı", value: "#EF4444" },
  { name: "Turuncu", value: "#FB923C" },
];

export default function LocalMultiplayerScreen() {
  const navigation = useNavigation<any>();
  const { t } = useLanguage();

  const [selectedBoard, setSelectedBoard] = useState<BoardSize | null>(null);
  const [selectedPlayers, setSelectedPlayers] = useState<PlayerCount | null>(null);
  const [turnTime, setTurnTime] = useState<TurnTime>(7);
  const [playersInfo, setPlayersInfo] = useState<PlayerInfo[]>([]);

  const boardOptions: BoardSize[] = ["4x4", "4x5", "4x6", "4x7"];
  const playerOptions: PlayerCount[] = [2, 3, 4];

  const handleSelectPlayerCount = (count: PlayerCount) => {
    setSelectedPlayers(count);

    setPlayersInfo(
      Array.from({ length: count }, (_, index) => ({
        name: playersInfo[index]?.name ?? "",
        color: playersInfo[index]?.color ?? "",
      }))
    );
  };

  const updatePlayerName = (index: number, name: string) => {
    const updated = [...playersInfo];
    updated[index].name = name.toLocaleUpperCase("tr-TR");
    setPlayersInfo(updated);
  };

  const updatePlayerColor = (index: number, color: string) => {
    const updated = [...playersInfo];
    updated[index].color = color;
    setPlayersInfo(updated);
  };

  const isColorUsed = (color: string, currentPlayerIndex: number) => {
    return playersInfo.some(
      (player, index) => index !== currentPlayerIndex && player.color === color
    );
  };

  const allPlayersReady =
    selectedPlayers !== null &&
    playersInfo.length === selectedPlayers &&
    playersInfo.every(
      (player) => player.name.trim().length > 0 && player.color.length > 0
    );

  const canStart = selectedBoard !== null && selectedPlayers !== null && allPlayersReady;

  const handleStart = () => {
    if (!selectedBoard || !selectedPlayers || !canStart) return;

    navigation.navigate("GameScreen", {
      boardSize: selectedBoard,
      playerCount: selectedPlayers,
      turnTime,
      players: playersInfo.map((player, index) => ({
        id: index + 1,
        name: player.name.trim(),
        color: player.color,
      })),
    });
  };

  return (
    <LinearGradient colors={["#070712", "#101035", "#171753"]} style={styles.container}>
      <SafeAreaView style={styles.safe}>
        <KeyboardAvoidingView
          style={styles.keyboard}
          behavior={Platform.OS === "ios" ? "padding" : undefined}
        >
          <View style={styles.glowOne} />
          <View style={styles.glowTwo} />

          <View style={styles.header}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => navigation.goBack()}
              activeOpacity={0.85}
            >
              <Text style={styles.backText}>‹</Text>
            </TouchableOpacity>

            <Text style={styles.logo}>MEMOLY</Text>
            <Text style={styles.subLogo}>LOCAL BATTLE</Text>
          </View>

          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.content}
          >
            <Text style={styles.title}>{t.localMultiplayer}</Text>
            <Text style={styles.description}>
              Tahta düzenini, oyuncu sayısını, tur süresini ve oyuncu bilgilerini seç.
            </Text>

            <View style={styles.panel}>
              <Text style={styles.sectionTitle}>{t.selectBoardLayout}</Text>

              <View style={styles.boardGrid}>
                {boardOptions.map((item) => {
                  const active = selectedBoard === item;

                  return (
                    <TouchableOpacity
                      key={item}
                      style={[styles.boardButton, active && styles.selectedButton]}
                      onPress={() => setSelectedBoard(item)}
                      activeOpacity={0.85}
                    >
                      <Text style={[styles.optionText, active && styles.selectedText]}>
                        {item}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

<View style={styles.panel}>
              <Text style={styles.sectionTitle}>Tur Süresi</Text>

              <View style={styles.timeGrid}>
                {[7, 14, 0].map((time) => {
                  const active = turnTime === time;

                  return (
                    <TouchableOpacity
                      key={time}
                      style={[styles.timeButton, active && styles.selectedButton]}
                      onPress={() => setTurnTime(time as TurnTime)}
                      activeOpacity={0.85}
                    >
                      <Text style={[styles.timeText, active && styles.selectedText]}>
                        {time === 0 ? "Sınırsız" : `${time} Sn`}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>
            
            <View style={styles.panel}>
              <Text style={styles.sectionTitle}>{t.selectPlayerCount}</Text>

              <View style={styles.playerGrid}>
                {playerOptions.map((item) => {
                  const active = selectedPlayers === item;

                  return (
                    <TouchableOpacity
                      key={item}
                      style={[styles.playerButton, active && styles.selectedButton]}
                      onPress={() => handleSelectPlayerCount(item)}
                      activeOpacity={0.85}
                    >
                      <View style={styles.playerIconsContainer}>
                        {Array.from({ length: item }).map((_, index) => (
                          <Text key={index} style={styles.playerIcon}>
                            👤
                          </Text>
                        ))}
                      </View>

                      <Text style={[styles.playerText, active && styles.selectedText]}>
                        {item} {t.person}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            

            {selectedPlayers && (
              <View style={styles.panel}>
                <Text style={styles.sectionTitle}>Oyuncu Bilgileri</Text>

                {playersInfo.map((player, playerIndex) => (
                  <View key={playerIndex} style={styles.playerInfoCard}>
                    <View style={styles.playerInfoHeader}>
                      <View
                        style={[
                          styles.playerNumberBadge,
                          {
                            backgroundColor:
                              player.color || "rgba(255,255,255,0.12)",
                          },
                        ]}
                      >
                        <Text style={styles.playerNumberText}>{playerIndex + 1}</Text>
                      </View>

                      <TextInput
                        style={styles.input}
                        placeholder={`${playerIndex + 1}. Oyuncu adı`}
                        placeholderTextColor="rgba(255,255,255,0.45)"
                        value={player.name}
                        autoCapitalize="characters"
                        onChangeText={(text) => updatePlayerName(playerIndex, text)}
                        maxLength={10}
                      />
                    </View>

                    <View style={styles.colorRow}>
                      {colorOptions.map((color) => {
                        const active = player.color === color.value;
                        const used = isColorUsed(color.value, playerIndex);

                        return (
                          <TouchableOpacity
                            key={color.value}
                            disabled={used}
                            style={[
                              styles.colorButton,
                              { borderColor: color.value },
                              active && { backgroundColor: color.value },
                              used && !active && styles.usedColorButton,
                            ]}
                            onPress={() => updatePlayerColor(playerIndex, color.value)}
                            activeOpacity={0.85}
                          >
                            <Text
                              style={[
                                styles.colorText,
                                active && styles.activeColorText,
                              ]}
                            >
                              {color.name}
                            </Text>
                          </TouchableOpacity>
                        );
                      })}
                    </View>
                  </View>
                ))}
              </View>
            )}

            <TouchableOpacity
              style={[styles.playButton, !canStart && styles.disabledButton]}
              onPress={handleStart}
              disabled={!canStart}
              activeOpacity={0.9}
            >
              <LinearGradient
                colors={
                  canStart
                    ? ["#8E7CFF", "#6C5CE7", "#00D2FF"]
                    : ["rgba(255,255,255,0.10)", "rgba(255,255,255,0.06)"]
                }
                style={styles.playGradient}
              >
                <Text style={[styles.playButtonText, !canStart && styles.disabledText]}>
                  {t.play}
                </Text>
              </LinearGradient>
            </TouchableOpacity>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },

  safe: { flex: 1 },

  keyboard: {
    flex: 1,
    paddingHorizontal: 22,
    paddingTop: 18,
  },

  glowOne: {
    position: "absolute",
    width: 260,
    height: 260,
    borderRadius: 130,
    backgroundColor: "rgba(108,92,231,0.32)",
    top: -95,
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
    marginBottom: 10,
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

  content: {
    paddingBottom: 28,
  },

  title: {
    fontSize: 27,
    fontWeight: "900",
    color: "#FFFFFF",
    textAlign: "center",
    marginTop: 8,
  },

  description: {
    marginTop: 8,
    marginBottom: 18,
    fontSize: 14,
    color: "#D8D8F0",
    textAlign: "center",
    lineHeight: 20,
  },

  panel: {
    width: "100%",
    padding: 15,
    borderRadius: 24,
    backgroundColor: "rgba(255,255,255,0.08)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.16)",
    marginBottom: 14,
  },

  sectionTitle: {
    fontSize: 17,
    fontWeight: "900",
    color: "#FFFFFF",
    marginBottom: 13,
  },

  boardGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },

  boardButton: {
    width: "47.8%",
    height: 52,
    borderRadius: 17,
    backgroundColor: "rgba(255,255,255,0.07)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.14)",
    alignItems: "center",
    justifyContent: "center",
  },

  playerGrid: {
    flexDirection: "row",
    gap: 10,
  },

  playerButton: {
    flex: 1,
    height: 72,
    borderRadius: 18,
    backgroundColor: "rgba(255,255,255,0.07)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.14)",
    alignItems: "center",
    justifyContent: "center",
  },

  selectedButton: {
    backgroundColor: "rgba(0,210,255,0.22)",
    borderColor: "#00D2FF",
  },

  optionText: {
    color: "#D8D8F0",
    fontSize: 19,
    fontWeight: "900",
  },

  selectedText: {
    color: "#FFFFFF",
  },

  playerIconsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 4,
  },

  playerIcon: {
    fontSize: 15,
    marginHorizontal: 1,
  },

  playerText: {
    color: "#D8D8F0",
    fontSize: 13,
    fontWeight: "900",
  },

  timeGrid: {
    flexDirection: "row",
    gap: 10,
  },

  timeButton: {
    flex: 1,
    height: 50,
    borderRadius: 16,
    backgroundColor: "rgba(255,255,255,0.07)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.14)",
    alignItems: "center",
    justifyContent: "center",
  },

  timeText: {
    color: "#D8D8F0",
    fontSize: 13,
    fontWeight: "900",
  },

  playerInfoCard: {
    padding: 12,
    borderRadius: 18,
    backgroundColor: "rgba(255,255,255,0.06)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.12)",
    marginBottom: 10,
  },

  playerInfoHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },

  playerNumberBadge: {
    width: 38,
    height: 38,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },

  playerNumberText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "900",
  },

  input: {
    flex: 1,
    height: 42,
    borderRadius: 15,
    backgroundColor: "rgba(255,255,255,0.08)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.14)",
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "900",
    paddingHorizontal: 13,
  },

  colorRow: {
    flexDirection: "row",
    gap: 7,
  },

  colorButton: {
    flex: 1,
    height: 34,
    borderRadius: 13,
    borderWidth: 1.4,
    backgroundColor: "rgba(255,255,255,0.06)",
    alignItems: "center",
    justifyContent: "center",
  },

  usedColorButton: {
    opacity: 0.25,
  },

  colorText: {
    color: "#FFFFFF",
    fontSize: 10,
    fontWeight: "900",
  },

  activeColorText: {
    color: "#111827",
  },

  playButton: {
    width: "100%",
    borderRadius: 22,
    overflow: "hidden",
    marginTop: 2,
    marginBottom: 4,
    shadowColor: "#00D2FF",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.28,
    shadowRadius: 18,
    elevation: 10,
  },

  disabledButton: {
    shadowOpacity: 0,
    elevation: 0,
  },

  playGradient: {
    paddingVertical: 17,
    alignItems: "center",
    justifyContent: "center",
  },

  playButtonText: {
    color: "#FFFFFF",
    fontSize: 21,
    fontWeight: "900",
  },

  disabledText: {
    color: "rgba(255,255,255,0.45)",
  },
});