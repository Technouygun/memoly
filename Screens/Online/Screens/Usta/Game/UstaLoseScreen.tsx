import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";

export default function UstaLoseScreen() {
  const navigation = useNavigation<any>();

  return (
    <View style={styles.container}>
      <Text style={styles.emoji}>😢</Text>
      <Text style={styles.title}>Kaybettin</Text>
      <Text style={styles.text}>Bu tur rakibin daha fazla eş buldu.</Text>

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.replace("FirstOnline")}
      >
        <Text style={styles.buttonText}>Online Menüye Dön</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#450a0a",
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  emoji: {
    fontSize: 90,
    marginBottom: 16,
  },
  title: {
    fontSize: 42,
    color: "#f87171",
    fontWeight: "900",
    marginBottom: 18,
  },
  text: {
    fontSize: 20,
    color: "#fff",
    fontWeight: "700",
    textAlign: "center",
  },
  button: {
    marginTop: 30,
    backgroundColor: "#ef4444",
    paddingVertical: 15,
    paddingHorizontal: 28,
    borderRadius: 18,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "900",
  },
});