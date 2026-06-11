import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useNavigation } from "@react-navigation/native";
import { useLanguage } from "../../language/LanguageContext";

export default function ExerciseFirst() {
  const navigation = useNavigation<any>();
  const { t } = useLanguage();

  return (
    <LinearGradient colors={["#070712", "#101035", "#171753"]} style={styles.container}>
      <SafeAreaView style={styles.safe}>
        <View style={styles.glowOne} />
        <View style={styles.glowTwo} />

        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <Text style={styles.backText}>‹</Text>
          </TouchableOpacity>

          <Text style={styles.logo}>MEMOLY</Text>
          <Text style={styles.subLogo}>BRAIN TRAINING</Text>
        </View>

        <View style={styles.content}>
          <Text style={styles.title}>{t.exerciseModes}</Text>
          <Text style={styles.description}>
            Odaklan, hatırla ve hafıza gücünü geliştirmek için egzersiz seç.
          </Text>

          <TouchableOpacity
            style={styles.card}
            onPress={() => navigation.navigate("SequenceMemoryScreen")}
            activeOpacity={0.9}
          >
            <Text style={styles.icon}>🔢</Text>
            <View style={styles.cardBody}>
              <Text style={styles.cardTitle}>{t.sequenceMemoryExercise}</Text>
              <Text style={styles.cardDesc}>Sıralamayı aklında tut ve doğru şekilde tekrar et.</Text>
            </View>
            <Text style={styles.arrow}>›</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.card}
            onPress={() => navigation.navigate("FlashMemoryScreen")}
            activeOpacity={0.9}
          >
            <Text style={styles.icon}>⚡</Text>
            <View style={styles.cardBody}>
              <Text style={styles.cardTitle}>{t.flashMemoryExercise}</Text>
              <Text style={styles.cardDesc}>Kısa süre görünen kartları hızlıca hatırla.</Text>
            </View>
            <Text style={styles.arrow}>›</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.card}
            onPress={() => navigation.navigate("NumberMemoryScreen")}
            activeOpacity={0.9}
          >
            <Text style={styles.icon}>🧠</Text>
            <View style={styles.cardBody}>
              <Text style={styles.cardTitle}>{t.numberMemoryExercise}</Text>
              <Text style={styles.cardDesc}>Sayıları ezberle, seviyeleri geçerek hafızanı zorla.</Text>
            </View>
            <Text style={styles.arrow}>›</Text>
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

  safe: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 18,
    paddingBottom: 24,
  },

  glowOne: {
    position: "absolute",
    width: 260,
    height: 260,
    borderRadius: 130,
    backgroundColor: "rgba(108,92,231,0.32)",
    top: -90,
    right: -100,
  },

  glowTwo: {
    position: "absolute",
    width: 230,
    height: 230,
    borderRadius: 115,
    backgroundColor: "rgba(0,210,255,0.17)",
    bottom: 90,
    left: -100,
  },

  header: {
    alignItems: "center",
    marginTop: 8,
  },

  backButton: {
    position: "absolute",
    left: 0,
    top: 0,
    width: 42,
    height: 42,
    borderRadius: 16,
    backgroundColor: "rgba(255,255,255,0.08)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.15)",
    alignItems: "center",
    justifyContent: "center",
  },

  backText: {
    color: "#FFFFFF",
    fontSize: 34,
    fontWeight: "700",
    marginTop: -4,
  },

  logo: {
    fontSize: 36,
    fontWeight: "900",
    color: "#FFFFFF",
    letterSpacing: 3,
  },

  subLogo: {
    marginTop: 5,
    color: "#00D2FF",
    fontSize: 12,
    fontWeight: "900",
    letterSpacing: 2,
  },

  content: {
    flex: 1,
    justifyContent: "center",
  },

  title: {
    fontSize: 30,
    fontWeight: "900",
    color: "#FFFFFF",
    textAlign: "center",
  },

  description: {
    marginTop: 10,
    marginBottom: 28,
    fontSize: 15,
    color: "#D8D8F0",
    textAlign: "center",
    lineHeight: 22,
  },

  card: {
    minHeight: 100,
    padding: 16,
    borderRadius: 24,
    backgroundColor: "rgba(255,255,255,0.08)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.16)",
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 14,
  },

  icon: {
    width: 52,
    height: 52,
    textAlign: "center",
    textAlignVertical: "center",
    fontSize: 27,
    borderRadius: 18,
    backgroundColor: "rgba(0,210,255,0.12)",
    overflow: "hidden",
    marginRight: 14,
  },

  cardBody: {
    flex: 1,
  },

  cardTitle: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "900",
  },

  cardDesc: {
    marginTop: 5,
    color: "#CFCFE6",
    fontSize: 13,
    fontWeight: "700",
    lineHeight: 18,
  },

  arrow: {
    color: "#00D2FF",
    fontSize: 34,
    fontWeight: "700",
    marginLeft: 8,
  },
});