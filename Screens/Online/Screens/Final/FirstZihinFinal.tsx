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

export default function FirstZihinFinal() {
  const navigation = useNavigation<any>();

  return (
    <ImageBackground
      source={require("../../../../assets/icon.png")}
      style={styles.background}
      resizeMode="cover"
    >
      <View style={styles.overlay}>
        <Text style={styles.title}>ZİHİN DEHASI FİNAL</Text>

        <Text style={styles.subtitle}>Final ligine hoş geldin.</Text>

        <View style={styles.infoBox}>
          <Text style={styles.infoText}>• 2 oyuncu eşleşir.</Text>
          <Text style={styles.infoText}>• Zihin Dehası ile aynı mantıkta oynanır.</Text>
          <Text style={styles.infoText}>• Oyun 6x8 oynanır.</Text>
          <Text style={styles.infoText}>• Giriş bedeli: 1 Final Bileti</Text>
          <Text style={styles.rewardText}>Büyük Final Ödülü</Text>
        </View>

        <TouchableOpacity
          style={styles.playButton}
          onPress={() => navigation.navigate("ZihinFinalLigi")}
        >
          <MaterialCommunityIcons name="ticket-confirmation" size={26} color="#fff" />
          <Text style={styles.playButtonText}>Finale Gir</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Text style={styles.backButtonText}>Geri Dön</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: { flex: 1, justifyContent: "center" },
  overlay: {
    margin: 20,
    padding: 22,
    borderRadius: 24,
    backgroundColor: "rgba(255,255,255,0.92)",
    alignItems: "center",
  },
  title: {
    fontSize: 30,
    fontWeight: "900",
    color: "#6d28d9",
    marginBottom: 10,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 18,
    color: "#333",
    marginBottom: 18,
    textAlign: "center",
  },
  infoBox: {
    width: "100%",
    backgroundColor: "#f5f3ff",
    borderRadius: 18,
    padding: 16,
    marginBottom: 22,
    borderWidth: 1,
    borderColor: "#ddd6fe",
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
    backgroundColor: "#7c3aed",
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
  backButton: { marginTop: 14 },
  backButtonText: {
    fontSize: 16,
    color: "#555",
    fontWeight: "700",
  },
});