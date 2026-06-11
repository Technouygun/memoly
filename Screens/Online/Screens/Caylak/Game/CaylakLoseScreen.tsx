import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useLanguage } from "../../../../language/LanguageContext";

export default function CaylakLoseScreen() {
  const navigation = useNavigation<any>();
const { t } = useLanguage();
  return (
    <View style={styles.container}>
      <Text style={styles.emoji}>😢</Text>
      <Text style={styles.title}>{t.youLost}</Text>

      <Text style={styles.text}>{t.loseMessage}</Text>

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.replace("OnlineTabs")}
      >
        <Text style={styles.buttonText}>{t.onlineMenu}</Text>
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