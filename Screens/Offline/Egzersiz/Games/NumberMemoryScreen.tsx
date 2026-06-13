import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Alert,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useNavigation } from "@react-navigation/native";
import { useLanguage } from "../../../../Screens/language/LanguageContext";

const TOTAL_STAGE = 7;
const SHOW_TIME = 5;
const keypadNumbers = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "sil", "0", "ok"];

export default function NumberMemoryScreen() {
  const navigation = useNavigation<any>();
  const { t } = useLanguage();

  const [stage, setStage] = useState(1);
  const [number, setNumber] = useState("");
  const [input, setInput] = useState("");
  const [showNumber, setShowNumber] = useState(false);
  const [started, setStarted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(SHOW_TIME);

  const timerRef = useRef<any>(null);
  const digitCount = stage + 3;

  const generateNumber = (length: number) => {
    let result = "";
    for (let i = 0; i < length; i++) {
      result += Math.floor(Math.random() * 10).toString();
    }
    return result;
  };

  const startStage = () => {
    const newNumber = generateNumber(digitCount);
    setNumber(newNumber);
    setInput("");
    setShowNumber(true);
    setStarted(true);
    setTimeLeft(SHOW_TIME);
  };

  useEffect(() => {
    if (!showNumber) return;

    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          setShowNumber(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timerRef.current);
  }, [showNumber]);

  const checkAnswer = () => {
    if (input.trim() === "") {
      Alert.alert(t.warning, t.enterNumber);
      return;
    }

    if (input === number) {
      if (stage === TOTAL_STAGE) {
        Alert.alert(t.congrats, t.allStagesCompleted, [
          {
            text: t.backToStart,
            onPress: () => {
              setStage(1);
              setStarted(false);
              setShowNumber(false);
              setInput("");
              setNumber("");
            },
          },
        ]);
      } else {
        Alert.alert(t.correct, t.nextStage, [
          {
            text: t.continue,
            onPress: () => {
              setStage((prev) => prev + 1);
              setStarted(false);
              setShowNumber(false);
              setInput("");
              setNumber("");
            },
          },
        ]);
      }
    } else {
      Alert.alert(t.wrong, `${t.correctNumber}: ${number}`, [
        {
          text: t.trySameStageAgain,
          onPress: () => {
            setStarted(false);
            setShowNumber(false);
            setInput("");
            setNumber("");
          },
        },
      ]);
    }
  };

  const handleKeyPress = (key: string) => {
    if (key === "sil") {
      setInput((prev) => prev.slice(0, -1));
      return;
    }

    if (key === "ok") {
      checkAnswer();
      return;
    }

    if (input.length >= digitCount) return;

    setInput((prev) => prev + key);
  };

  return (
    <LinearGradient colors={["#070712", "#101035", "#171753"]} style={styles.container}>
      <SafeAreaView style={styles.safe}>
        <View style={{ height: 50}} />
        <View style={styles.glowOne} />
        <View style={styles.glowTwo} />

        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <Text style={styles.backText}>‹</Text>
          </TouchableOpacity>

          <Text style={styles.logo}>MEMOLY</Text>
          <Text style={styles.subLogo}>NUMBER MEMORY</Text>
        </View>

        <View style={styles.content}>
          <View style={styles.infoPanel}>
            <Text style={styles.title}>{t.numberMemoryExercise}</Text>

            <View style={styles.statsRow}>
              <View style={styles.statBox}>
                <Text style={styles.statLabel}>{t.stage}</Text>
                <Text style={styles.statValue}>{stage}/{TOTAL_STAGE}</Text>
              </View>

              <View style={styles.statBox}>
                <Text style={styles.statLabel}>{t.digitNumber}</Text>
                <Text style={styles.statValue}>{digitCount}</Text>
              </View>
            </View>
          </View>

          {!started && (
            <TouchableOpacity style={styles.startButton} onPress={startStage}>
              <LinearGradient
                colors={["#8E7CFF", "#6C5CE7", "#00D2FF"]}
                style={styles.buttonGradient}
              >
                <Text style={styles.buttonText}>{t.start}</Text>
              </LinearGradient>
            </TouchableOpacity>
          )}

          {started && showNumber && (
            <View style={styles.numberBox}>
              <Text style={styles.numberText}>{number}</Text>

              <View style={styles.timerPill}>
                <Text style={styles.timerText}>
                  {timeLeft} {t.second}
                </Text>
              </View>
            </View>
          )}

          {started && !showNumber && (
            <View style={styles.answerBox}>
              <Text style={styles.questionText}>{t.enterSeenNumber}</Text>

              <View style={styles.displayBox}>
                <Text style={styles.displayText}>
                  {input.length > 0 ? input : t.writeNumber}
                </Text>
              </View>

              <View style={styles.keypad}>
                {keypadNumbers.map((key) => (
                  <TouchableOpacity
                    key={key}
                    style={[
                      styles.keyButton,
                      key === "ok" && styles.okButton,
                      key === "sil" && styles.deleteButton,
                    ]}
                    onPress={() => handleKeyPress(key)}
                    activeOpacity={0.85}
                  >
                    <Text
                      style={[
                        styles.keyText,
                        key === "ok" && styles.actionKeyText,
                        key === "sil" && styles.actionKeyText,
                      ]}
                    >
                      {key === "sil" ? "⌫" : key === "ok" ? "✓" : key}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
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

  content: {
    flex: 1,
    justifyContent: "center",
  },

  infoPanel: {
    padding: 16,
    borderRadius: 24,
    backgroundColor: "rgba(255,255,255,0.08)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.16)",
    marginBottom: 20,
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

  startButton: {
    width: "100%",
    borderRadius: 22,
    overflow: "hidden",
  },

  buttonGradient: {
    paddingVertical: 17,
    alignItems: "center",
  },

  buttonText: {
    color: "#FFFFFF",
    fontSize: 20,
    fontWeight: "900",
  },

  numberBox: {
    width: "100%",
    borderRadius: 28,
    paddingVertical: 34,
    paddingHorizontal: 14,
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.09)",
    borderWidth: 1,
    borderColor: "rgba(0,210,255,0.35)",
  },

  numberText: {
    fontSize: 40,
    fontWeight: "900",
    color: "#FFFFFF",
    letterSpacing: 4,
    textAlign: "center",
  },

  timerPill: {
    marginTop: 18,
    paddingHorizontal: 18,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: "rgba(0,210,255,0.14)",
    borderWidth: 1,
    borderColor: "rgba(0,210,255,0.35)",
  },

  timerText: {
    color: "#00D2FF",
    fontSize: 15,
    fontWeight: "900",
  },

  answerBox: {
    width: "100%",
    alignItems: "center",
  },

  questionText: {
    fontSize: 18,
    color: "#FFFFFF",
    marginBottom: 12,
    fontWeight: "900",
    textAlign: "center",
  },

  displayBox: {
    width: "100%",
    minHeight: 58,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.08)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.16)",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 12,
    marginBottom: 14,
  },

  displayText: {
    color: "#FFFFFF",
    fontSize: 24,
    fontWeight: "900",
    letterSpacing: 3,
    textAlign: "center",
  },

  keypad: {
    width: "100%",
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },

  keyButton: {
    width: "30.9%",
    height: 58,
    borderRadius: 18,
    backgroundColor: "rgba(255,255,255,0.08)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.16)",
    alignItems: "center",
    justifyContent: "center",
  },

  okButton: {
    backgroundColor: "rgba(34,197,94,0.25)",
    borderColor: "#86EFAC",
  },

  deleteButton: {
    backgroundColor: "rgba(239,68,68,0.20)",
    borderColor: "#EF4444",
  },

  keyText: {
    color: "#FFFFFF",
    fontSize: 24,
    fontWeight: "900",
  },

  actionKeyText: {
    fontSize: 26,
  },
});