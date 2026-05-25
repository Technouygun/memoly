import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

export default function FirstCaylak() {
  const navigation = useNavigation<any>();

  return (
    <ImageBackground
      source={require("../../../../assets/icon.png")}
      style={styles.background}
      resizeMode="cover"
    >
      <View style={styles.overlay}>
        <Text style={styles.title}>ÇAYLAK LİGİ</Text>

        <Text style={styles.subtitle}>Çaylak ligine hoş geldin.</Text>

        <View style={styles.infoBox}>
          <Text style={styles.infoText}>• 2 oyuncu eşleşir.</Text>
          <Text style={styles.infoText}>• Hafıza oyunu online oynanır.</Text>
          <Text style={styles.infoText}>• En çok kart eşini bulan kazanır.</Text>
          <Text style={styles.infoText}>• Giriş bedeli: 100 Coin</Text>
          <Text style={styles.rewardText}>Ödül: 200 Coin</Text>
        </View>

        <TouchableOpacity
          style={styles.playButton}
          onPress={() => navigation.navigate("CaylakLigi")}
        >
          <MaterialCommunityIcons name="play" size={26} color="#fff" />
          <Text style={styles.playButtonText}>Oyna</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonText}>Geri Dön</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    justifyContent: "center",
  },
  overlay: {
    margin: 20,
    padding: 22,
    borderRadius: 24,
    backgroundColor: "rgba(255,255,255,0.92)",
    alignItems: "center",
  },
  title: {
    fontSize: 34,
    fontWeight: "900",
    color: "#d2691e",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    color: "#333",
    marginBottom: 18,
    textAlign: "center",
  },
  infoBox: {
    width: "100%",
    backgroundColor: "#fff7ed",
    borderRadius: 18,
    padding: 16,
    marginBottom: 22,
    borderWidth: 1,
    borderColor: "#fed7aa",
  },
  infoText: {
    fontSize: 16,
    color: "#333",
    marginBottom: 9,
  },
  rewardText: {
    fontSize: 20,
    fontWeight: "900",
    color: "#16a34a",
    textAlign: "center",
    marginTop: 8,
  },
  playButton: {
    width: "90%",
    height: 56,
    borderRadius: 18,
    backgroundColor: "#22c55e",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 8,
  },
  playButtonText: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "900",
  },
  backButton: {
    marginTop: 14,
  },
  backButtonText: {
    fontSize: 16,
    color: "#555",
    fontWeight: "700",
  },
});