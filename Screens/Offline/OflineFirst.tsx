import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

type OfflineModesScreenProps = {
  onLocalMultiplayer: () => void;
  onExercise: () => void;
  onHome: () => void;
};

export default function OfflineModesScreen({
  onLocalMultiplayer,
  onExercise,
  onHome,
}: OfflineModesScreenProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.logo}>MEMOLY</Text>

      <Text style={styles.title}>Çevrimdışı Modlar</Text>

      <Text style={styles.description}>
        İnternetsiz oynayabileceğin oyun modunu seç.
      </Text>

      <View style={styles.buttons}>
        <TouchableOpacity
          style={styles.primaryButton}
          onPress={onLocalMultiplayer}
        >
          <Text style={styles.primaryButtonText}>Tek Telefon Çok Kişi</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.secondaryButton} onPress={onExercise}>
          <Text style={styles.secondaryButtonText}>Egzersiz</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.homeButton} onPress={onHome}>
        <Text style={styles.homeButtonText}>Anasayfa</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: "#10101A",
    justifyContent: "center",
    alignItems: "center",
  },

  logo: {
    fontSize: 42,
    fontWeight: "900",
    color: "#6C5CE7",
    marginBottom: 10,
    letterSpacing: 2,
  },

  title: {
    fontSize: 26,
    fontWeight: "900",
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

  buttons: {
    width: "100%",
    gap: 16,
    marginBottom: 40,
  },

  primaryButton: {
    width: "100%",
    backgroundColor: "#6C5CE7",
    paddingVertical: 18,
    borderRadius: 18,
    alignItems: "center",
  },

  primaryButtonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "900",
  },

  secondaryButton: {
    width: "100%",
    backgroundColor: "#1B1B2B",
    paddingVertical: 18,
    borderRadius: 18,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#2E2E44",
  },

  secondaryButtonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "800",
  },

  homeButton: {
    position: "absolute",
    bottom: 34,
    width: "100%",
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: "center",
  },

  homeButtonText: {
    color: "#AFAFD1",
    fontSize: 16,
    fontWeight: "800",
  },
});