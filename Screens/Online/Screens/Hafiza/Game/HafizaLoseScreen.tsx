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

export default function HafizaLoseScreen() {
  const navigation = useNavigation<any>();

  return (
    <LinearGradient
      colors={["#450a0a", "#7f1d1d", "#1c1917"]}
      style={styles.container}
    >
      <SafeAreaView style={{ flex: 1 }}>
        <View style={styles.content}>
          <Ionicons name="close-circle" size={120} color="#ef4444" />

          <Text style={styles.title}>KAYBETTİN</Text>

          <Text style={styles.subtitle}>
            Bu maçı rakibin kazandı.
          </Text>

          <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.navigate("FirstHafiza")}
          >
            <Text style={styles.buttonText}>
              Tekrar Dene
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

  subtitle: {
    color: "#fecaca",
    fontSize: 18,
    textAlign: "center",
    marginTop: 20,
  },

  button: {
    marginTop: 50,
    backgroundColor: "#ef4444",
    paddingVertical: 16,
    paddingHorizontal: 50,
    borderRadius: 18,
  },

  buttonText: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
  },
});