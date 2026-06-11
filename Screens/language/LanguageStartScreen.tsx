import React, { useState } from "react";
import {
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { AppLanguage, useLanguage } from "../../Screens/language/LanguageContext";

export default function LanguageStartScreen() {
  const { setLanguage } = useLanguage();
  const [selected, setSelected] = useState<AppLanguage>("tr");

  const handleContinue = async () => {
    await setLanguage(selected);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.logo}>🧠</Text>

        <Text style={styles.title}>
          {selected === "tr" ? "Dil Seç" : "Select Language"}
        </Text>

        <TouchableOpacity
          style={[
            styles.languageButton,
            selected === "tr" && styles.selectedButton,
          ]}
          onPress={() => setSelected("tr")}
        >
          <Text style={styles.languageText}>Türkçe</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.languageButton,
            selected === "en" && styles.selectedButton,
          ]}
          onPress={() => setSelected("en")}
        >
          <Text style={styles.languageText}>English</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.continueButton} onPress={handleContinue}>
          <Text style={styles.continueText}>
            {selected === "tr" ? "Devam Et" : "Continue"}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#101827",
  },
  content: {
    flex: 1,
    padding: 24,
    justifyContent: "center",
  },
  logo: {
    fontSize: 70,
    textAlign: "center",
    marginBottom: 20,
  },
  title: {
    color: "#fff",
    fontSize: 32,
    fontWeight: "800",
    textAlign: "center",
    marginBottom: 35,
  },
  languageButton: {
    backgroundColor: "#1f2937",
    paddingVertical: 18,
    borderRadius: 18,
    alignItems: "center",
    marginBottom: 16,
    borderWidth: 2,
    borderColor: "transparent",
  },
  selectedButton: {
    borderColor: "#22c55e",
    backgroundColor: "#14532d",
  },
  languageText: {
    color: "#fff",
    fontSize: 21,
    fontWeight: "700",
  },
  continueButton: {
    backgroundColor: "#2563eb",
    paddingVertical: 18,
    borderRadius: 18,
    alignItems: "center",
    marginTop: 20,
  },
  continueText: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "800",
  },
});