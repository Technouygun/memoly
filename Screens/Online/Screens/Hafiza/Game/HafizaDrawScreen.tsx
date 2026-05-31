import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

export default function HafizaDrawScreen() {
  const navigation = useNavigation<any>();

  return (
    <LinearGradient
      colors={["#1e293b", "#334155", "#0f172a"]}
      style={styles.container}
    >
      <SafeAreaView style={{ flex: 1 }}>
        <View style={styles.content}>
          <Ionicons name="remove-circle" size={120} color="#38bdf8" />

          <Text style={styles.title}>BERABERE</Text>

          <Text style={styles.reward}>
            +2500 Coin
          </Text>

          <Text style={styles.subtitle}>
            İki oyuncu da aynı skora ulaştı.
          </Text>

          <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.navigate("FirstHafiza")}
          >
            <Text style={styles.buttonText}>
              Devam Et
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 25,
  },

  title: {
    color: "white",
    fontSize: 42,
    fontWeight: "bold",
    marginTop: 20,
  },

  reward: {
    color: "#38bdf8",
    fontSize: 34,
    fontWeight: "bold",
    marginTop: 20,
  },

  subtitle: {
    color: "#cbd5e1",
    fontSize: 18,
    textAlign: "center",
    marginTop: 20,
  },

  button: {
    marginTop: 50,
    backgroundColor: "#38bdf8",
    paddingVertical: 16,
    paddingHorizontal: 50,
    borderRadius: 18,
  },

  buttonText: {
    color: "#0f172a",
    fontSize: 20,
    fontWeight: "bold",
  },
});