import React from "react";
import {
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useNavigation } from "@react-navigation/native";
import { useLanguage, AppLanguage } from "../../Screens/language/LanguageContext";

export default function LanguageScreen() {
  const navigation = useNavigation<any>();
  const { language, setLanguage, t } = useLanguage();

  const changeLanguage = async (lang: AppLanguage) => {
    await setLanguage(lang);
  };

  return (
    <LinearGradient colors={["#070712", "#101035", "#171753"]} style={styles.container}>
      <SafeAreaView style={styles.safe}>
        <View style={styles.glowOne} />
        <View style={styles.glowTwo} />

        <View style={styles.header}>
          <Text style={styles.logo}>MEMOLY</Text>
          <Text style={styles.subLogo}>LANGUAGE SETTINGS</Text>
        </View>

        <View style={styles.content}>
          <View style={styles.iconBadge}>
            <Text style={styles.icon}>🌐</Text>
          </View>

          <Text style={styles.title}>{t.selectLanguage}</Text>
          <Text style={styles.description}>
            Uygulama dilini seç. Online eşleşmeler farklı diller arasında çalışmaya devam eder.
          </Text>

          <View style={styles.card}>
            <TouchableOpacity
              activeOpacity={0.88}
              style={[
                styles.languageButton,
                language === "tr" && styles.selectedButton,
              ]}
              onPress={() => changeLanguage("tr")}
            >
              <View style={styles.langLeft}>
                <Text style={styles.flag}>🇹🇷</Text>
                <View>
                  <Text style={styles.languageText}>{t.turkish}</Text>
                  <Text style={styles.languageSubText}>Türkçe arayüz</Text>
                </View>
              </View>

              <View
                style={[
                  styles.checkCircle,
                  language === "tr" && styles.selectedCircle,
                ]}
              >
                {language === "tr" && <Text style={styles.checkText}>✓</Text>}
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.88}
              style={[
                styles.languageButton,
                language === "en" && styles.selectedButton,
              ]}
              onPress={() => changeLanguage("en")}
            >
              <View style={styles.langLeft}>
                <Text style={styles.flag}>🇬🇧</Text>
                <View>
                  <Text style={styles.languageText}>{t.english}</Text>
                  <Text style={styles.languageSubText}>English interface</Text>
                </View>
              </View>

              <View
                style={[
                  styles.checkCircle,
                  language === "en" && styles.selectedCircle,
                ]}
              >
                {language === "en" && <Text style={styles.checkText}>✓</Text>}
              </View>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
            activeOpacity={0.9}
          >
            <LinearGradient
              colors={["#8E7CFF", "#6C5CE7", "#00D2FF"]}
              style={styles.backGradient}
            >
              <Text style={styles.backText}>{t.backHome}</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },

  safe: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 28,
    paddingBottom: 28,
  },

  glowOne: {
    position: "absolute",
    width: 260,
    height: 260,
    borderRadius: 130,
    backgroundColor: "rgba(108,92,231,0.32)",
    top: -95,
    right: -105,
  },

  glowTwo: {
    position: "absolute",
    width: 230,
    height: 230,
    borderRadius: 115,
    backgroundColor: "rgba(0,210,255,0.17)",
    bottom: 80,
    left: -105,
  },

  header: {
    alignItems: "center",
    marginTop: 10,
  },

  logo: {
    fontSize: 38,
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

  iconBadge: {
    alignSelf: "center",
    width: 86,
    height: 86,
    borderRadius: 28,
    backgroundColor: "rgba(255,255,255,0.08)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.16)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 18,
  },

  icon: {
    fontSize: 42,
  },

  title: {
    color: "#FFFFFF",
    fontSize: 30,
    fontWeight: "900",
    textAlign: "center",
  },

  description: {
    marginTop: 10,
    marginBottom: 28,
    color: "#D8D8F0",
    fontSize: 14,
    fontWeight: "700",
    lineHeight: 21,
    textAlign: "center",
  },

  card: {
    backgroundColor: "rgba(255,255,255,0.08)",
    borderRadius: 26,
    padding: 14,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.16)",
    gap: 12,
  },

  languageButton: {
    minHeight: 78,
    borderRadius: 22,
    paddingHorizontal: 16,
    backgroundColor: "rgba(255,255,255,0.07)",
    borderWidth: 1.4,
    borderColor: "rgba(255,255,255,0.14)",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  selectedButton: {
    backgroundColor: "rgba(0,210,255,0.18)",
    borderColor: "#00D2FF",
  },

  langLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },

  flag: {
    fontSize: 34,
    marginRight: 14,
  },

  languageText: {
    color: "#FFFFFF",
    fontSize: 19,
    fontWeight: "900",
  },

  languageSubText: {
    marginTop: 3,
    color: "#BFC0DD",
    fontSize: 12,
    fontWeight: "700",
  },

  checkCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: "rgba(255,255,255,0.22)",
    alignItems: "center",
    justifyContent: "center",
  },

  selectedCircle: {
    backgroundColor: "#00D2FF",
    borderColor: "#00D2FF",
  },

  checkText: {
    color: "#07111F",
    fontSize: 17,
    fontWeight: "900",
  },

  backButton: {
    width: "100%",
    borderRadius: 22,
    overflow: "hidden",
    marginTop: 22,
    shadowColor: "#00D2FF",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.28,
    shadowRadius: 18,
    elevation: 10,
  },

  backGradient: {
    paddingVertical: 17,
    alignItems: "center",
  },

  backText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "900",
  },
});