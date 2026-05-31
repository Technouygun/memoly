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

export default function FirstHafiza() {
  const navigation = useNavigation<any>();

  return (
    <LinearGradient
      colors={["#0f172a", "#1e293b", "#020617"]}
      style={styles.container}
    >
      <SafeAreaView style={{ flex: 1 }}>
        <View style={styles.content}>
          <Ionicons name="diamond" size={70} color="#facc15" />

          <Text style={styles.title}>Hafıza Ligi</Text>

          <Text style={styles.subtitle}>
            En güçlü hafıza oyuncularına karşı mücadele et.
          </Text>

          <View style={styles.infoBox}>
            <View style={styles.row}>
              <Ionicons name="grid" size={24} color="#38bdf8" />
              <Text style={styles.infoText}>Oyun Modu: 6x6</Text>
            </View>

            <View style={styles.row}>
              <Ionicons name="cash" size={24} color="#22c55e" />
              <Text style={styles.infoText}>Giriş Ücreti: 2500 Coin</Text>
            </View>

            <View style={styles.row}>
              <Ionicons name="trophy" size={24} color="#facc15" />
              <Text style={styles.infoText}>Kazanan: 5000 Coin</Text>
            </View>

            <View style={styles.row}>
              <Ionicons name="gift" size={24} color="#c084fc" />
              <Text style={styles.infoText}>
                Bonus: 1 Freeze Joker
              </Text>
            </View>
          </View>

          <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.navigate("HafizaLigi")}
          >
            <LinearGradient
              colors={["#facc15", "#eab308"]}
              style={styles.buttonGradient}
            >
              <Text style={styles.buttonText}>Lige Katıl</Text>
            </LinearGradient>
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
    fontSize: 38,
    fontWeight: "bold",
    color: "white",
    marginTop: 20,
  },

  subtitle: {
    fontSize: 16,
    color: "#cbd5e1",
    textAlign: "center",
    marginTop: 12,
    marginBottom: 35,
  },

  infoBox: {
    width: "100%",
    backgroundColor: "rgba(255,255,255,0.08)",
    borderRadius: 25,
    padding: 22,
    marginBottom: 40,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
  },

  row: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 18,
  },

  infoText: {
    color: "white",
    fontSize: 18,
    marginLeft: 14,
    fontWeight: "600",
  },

  button: {
    width: "100%",
  },

  buttonGradient: {
    paddingVertical: 18,
    borderRadius: 20,
    alignItems: "center",
  },

  buttonText: {
    color: "#111827",
    fontSize: 20,
    fontWeight: "bold",
  },
});