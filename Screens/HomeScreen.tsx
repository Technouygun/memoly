import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

type HomeScreenProps = {
  onOnlinePlay: () => void;
  onOfflineModes: () => void;
  onSettings: () => void;
};

export default function HomeScreen({
  onOnlinePlay,
  onOfflineModes,
  onSettings,
}: HomeScreenProps) {
  return (
    <View style={styles.container}>
      <View style={styles.topContent}>
        <Text style={styles.logo}>MEMOLY</Text>

        <Text style={styles.title}>Hafıza Kart Oyunu</Text>

        <Text style={styles.description}>
          Kartları aç, eşleşmeleri bul ve rakibinden daha fazla kart topla.
        </Text>

        <TouchableOpacity style={styles.playButton} onPress={onOnlinePlay}>
          <Text style={styles.playButtonText}>Oyna</Text>
          <Text style={styles.buttonSubText}>Çevrimiçi moda gir</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.offlineButton}
          onPress={onOfflineModes}
        >
          <Text style={styles.offlineButtonText}>Çevrimdışı Modlar</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.settingsButton} onPress={onSettings}>
        <Text style={styles.settingsText}>Ayarlar</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: "#10101A",
    justifyContent: "space-between",
  },

  topContent: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  logo: {
    fontSize: 46,
    fontWeight: "900",
    color: "#6C5CE7",
    marginBottom: 10,
    letterSpacing: 2,
  },

  title: {
    fontSize: 24,
    fontWeight: "800",
    color: "#FFFFFF",
    marginBottom: 10,
  },

  description: {
    fontSize: 15,
    color: "#CFCFE6",
    textAlign: "center",
    marginBottom: 36,
    lineHeight: 22,
  },

  playButton: {
    width: "100%",
    backgroundColor: "#6C5CE7",
    paddingVertical: 18,
    borderRadius: 18,
    alignItems: "center",
    marginBottom: 16,
  },

  playButtonText: {
    color: "#FFFFFF",
    fontSize: 22,
    fontWeight: "900",
  },

  buttonSubText: {
    color: "#EDEBFF",
    fontSize: 13,
    fontWeight: "600",
    marginTop: 4,
  },

  offlineButton: {
    width: "100%",
    backgroundColor: "#1B1B2B",
    paddingVertical: 16,
    borderRadius: 18,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#2E2E44",
  },

  offlineButtonText: {
    color: "#FFFFFF",
    fontSize: 17,
    fontWeight: "800",
  },

  settingsButton: {
    width: "100%",
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: "center",
    marginBottom: 10,
  },

  settingsText: {
    color: "#AFAFD1",
    fontSize: 16,
    fontWeight: "700",
  },
});