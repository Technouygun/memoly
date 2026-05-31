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

export default function HafizaWinScreen() {
  const navigation = useNavigation<any>();

  return (
    <LinearGradient
      colors={["#14532d", "#166534", "#052e16"]}
      style={styles.container}
    >
      <SafeAreaView style={{ flex: 1 }}>
        <View style={styles.content}>
          <Ionicons name="trophy" size={120} color="#facc15" />

          <Text style={styles.title}>KAZANDIN!</Text>

          <Text style={styles.reward}>
            +7500 Coin
          </Text>

          <Text style={styles.subtitle}>
            Hafıza Ligi maçını başarıyla tamamladın.
          </Text>

          <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.navigate("FirstHafiza")}
          >
            <Text style={styles.buttonText}>
              Ana Sayfa
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
    color: "#facc15",
    fontSize: 34,
    fontWeight: "bold",
    marginTop: 20,
  },

  subtitle: {
    color: "#d1fae5",
    fontSize: 18,
    textAlign: "center",
    marginTop: 20,
  },

  button: {
    marginTop: 50,
    backgroundColor: "#facc15",
    paddingVertical: 16,
    paddingHorizontal: 50,
    borderRadius: 18,
  },

  buttonText: {
    color: "#111827",
    fontSize: 20,
    fontWeight: "bold",
  },
});