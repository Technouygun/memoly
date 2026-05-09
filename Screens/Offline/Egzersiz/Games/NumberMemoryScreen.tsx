import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  TextInput,
  Alert,
} from "react-native";
import { useNavigation } from "@react-navigation/native";

const TOTAL_STAGE = 7;
const SHOW_TIME = 5;

export default function NumberMemoryScreen() {
  const navigation = useNavigation<any>();

  const [stage, setStage] = useState(1);
  const [number, setNumber] = useState("");
  const [input, setInput] = useState("");
  const [showNumber, setShowNumber] = useState(false);
  const [started, setStarted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(SHOW_TIME);

  const timerRef = useRef<any>(null);

  const digitCount = stage + 3; // 1.etap 4 hane, 7.etap 10 hane

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
      Alert.alert("Uyarı", "Lütfen sayıyı gir.");
      return;
    }

    if (input === number) {
      if (stage === TOTAL_STAGE) {
        Alert.alert("Tebrikler!", "Tüm etapları başarıyla tamamladın.", [
          {
            text: "Başa dön",
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
        Alert.alert("Doğru!", "Sonraki etaba geçiyorsun.", [
          {
            text: "Devam",
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
      Alert.alert("Yanlış", `Doğru sayı: ${number}`, [
        {
          text: "Aynı etabı tekrar dene",
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

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Sayı Hafıza Egzersizi</Text>

        <Text style={styles.stageText}>
          Etap {stage} / {TOTAL_STAGE}
        </Text>

        <Text style={styles.infoText}>{digitCount} haneli sayı</Text>

        {!started && (
          <TouchableOpacity style={styles.startButton} onPress={startStage}>
            <Text style={styles.buttonText}>Başla</Text>
          </TouchableOpacity>
        )}

        {started && showNumber && (
          <View style={styles.numberBox}>
            <Text style={styles.numberText}>{number}</Text>
            <Text style={styles.timerText}>{timeLeft} saniye</Text>
          </View>
        )}

        {started && !showNumber && (
          <View style={styles.answerBox}>
            <Text style={styles.questionText}>Gördüğün sayıyı gir</Text>

            <TextInput
              style={styles.input}
              value={input}
              onChangeText={setInput}
              keyboardType="number-pad"
              maxLength={digitCount}
              placeholder="Sayıyı yaz"
              placeholderTextColor="#999"
            />

            <TouchableOpacity style={styles.checkButton} onPress={checkAnswer}>
              <Text style={styles.buttonText}>Kontrol Et</Text>
            </TouchableOpacity>
          </View>
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
    backgroundColor: "#101820",
  },
  content: {
    flex: 1,
    padding: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 30,
    fontWeight: "800",
    color: "#fff",
    marginBottom: 24,
    textAlign: "center",
  },
  stageText: {
    fontSize: 22,
    color: "#FEE715",
    fontWeight: "700",
    marginBottom: 8,
  },
  infoText: {
    fontSize: 18,
    color: "#ddd",
    marginBottom: 30,
  },
  startButton: {
    width: "100%",
    backgroundColor: "#FEE715",
    paddingVertical: 18,
    borderRadius: 18,
    alignItems: "center",
  },
  buttonText: {
    color: "#101820",
    fontSize: 20,
    fontWeight: "800",
  },
  numberBox: {
    width: "100%",
    backgroundColor: "#fff",
    borderRadius: 22,
    paddingVertical: 35,
    alignItems: "center",
  },
  numberText: {
    fontSize: 42,
    fontWeight: "900",
    color: "#101820",
    letterSpacing: 4,
  },
  timerText: {
    marginTop: 18,
    fontSize: 18,
    color: "#444",
    fontWeight: "700",
  },
  answerBox: {
    width: "100%",
    alignItems: "center",
  },
  questionText: {
    fontSize: 20,
    color: "#fff",
    marginBottom: 16,
    fontWeight: "700",
  },
  input: {
    width: "100%",
    backgroundColor: "#fff",
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 18,
    fontSize: 24,
    textAlign: "center",
    color: "#101820",
    fontWeight: "800",
    letterSpacing: 3,
    marginBottom: 18,
  },
  checkButton: {
    width: "100%",
    backgroundColor: "#FEE715",
    paddingVertical: 16,
    borderRadius: 18,
    alignItems: "center",
  },
  backButton: {
    marginTop: 30,
  },
  backButtonText: {
    color: "#fff",
    fontSize: 17,
    fontWeight: "700",
  },
});