import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
} from "react-native";
import { useNavigation } from "@react-navigation/native";

export default function ExerciseFirst() {
  const navigation = useNavigation<any>();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Egzersiz Modları</Text>

        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate("SequenceMemoryScreen")}
        >
          <Text style={styles.buttonText}>Sıralı Hafıza Egzersizi</Text>
        </TouchableOpacity>
<TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate("FlashMemoryScreen")}
        >
          <Text style={styles.buttonText}>Görsel Hafıza Egzersizi</Text>
        </TouchableOpacity>
    
    <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate("NumberMemoryScreen")}
        >
          <Text style={styles.buttonText}>Sayı Hafıza Egzersizi</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonText}>Geri Dön</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#111827",
  },

  content: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 24,
  },

  title: {
    fontSize: 30,
    fontWeight: "800",
    color: "#F9FAFB",
    textAlign: "center",
    marginBottom: 40,
  },

  button: {
    backgroundColor: "#2563EB",
    paddingVertical: 18,
    borderRadius: 18,
    marginBottom: 18,
    alignItems: "center",
  },

  buttonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "700",
  },

  backButton: {
    marginTop: 20,
    backgroundColor: "#374151",
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: "center",
  },

  backButtonText: {
    color: "#F9FAFB",
    fontSize: 16,
    fontWeight: "700",
  },
});