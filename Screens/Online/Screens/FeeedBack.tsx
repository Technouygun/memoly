import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Keyboard,
  TouchableWithoutFeedback,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useNavigation } from "@react-navigation/native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { getAuth } from "firebase/auth";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { firestore } from "../../../firebaseConfig";
import { useLanguage } from "../../language/LanguageContext";

export default function FeedBack() {
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const navigation = useNavigation<any>();
  const { t } = useLanguage();

  const sendFeedback = async () => {
    Keyboard.dismiss();

    if (!message.trim()) {
      Alert.alert(t.warning, t.feedbackEmpty);
      return;
    }

    try {
      setLoading(true);

      const user = getAuth().currentUser;

      await addDoc(collection(firestore, "feedbacks"), {
        message: message.trim(),
        userId: user ? user.uid : null,
        createdAt: serverTimestamp(),
        platform: Platform.OS,
        appVersion: "183",
      });

      setMessage("");
      Alert.alert(t.feedbackThanksTitle, t.feedbackThanksMessage);
    } catch (error) {
      Alert.alert(t.error, t.feedbackSendError);
    } finally {
      setLoading(false);
    }
  };

  return (
    <LinearGradient colors={["#070712", "#101035", "#171753"]} style={styles.container}>
      <SafeAreaView style={styles.safe}>
        <KeyboardAvoidingView
          style={styles.keyboard}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
          <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
            <ScrollView
              contentContainerStyle={styles.scrollContent}
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}
            >
              <View style={styles.glowOne} />
              <View style={styles.glowTwo} />

              <View style={styles.header}>
                <Text style={styles.logo}>MEMOLY</Text>
                <Text style={styles.subLogo}>FEEDBACK CENTER</Text>
              </View>

              <View style={styles.card}>
                <View style={styles.iconBadge}>
                  <Icon name="message-text-outline" size={38} color="#00D2FF" />
                </View>

                <Text style={styles.title}>{t.feedbackTitle}</Text>
                <Text style={styles.subtitle}>{t.feedbackSubtitle}</Text>

                <View style={styles.inputWrapper}>
                  <TextInput
                    style={styles.input}
                    placeholder={t.feedbackPlaceholder}
                    placeholderTextColor="rgba(255,255,255,0.38)"
                    multiline
                    value={message}
                    onChangeText={setMessage}
                    maxLength={500}
                    textAlignVertical="top"
                  />

                  <View style={styles.counterRow}>
                    <Icon name="pencil-outline" size={15} color="#00D2FF" />
                    <Text style={styles.counter}>{message.length}/500</Text>
                  </View>
                </View>

                <TouchableOpacity
                  style={[styles.primaryButton, loading && styles.disabledButton]}
                  onPress={sendFeedback}
                  disabled={loading}
                  activeOpacity={0.9}
                >
                  <LinearGradient
                    colors={["#8E7CFF", "#6C5CE7", "#00D2FF"]}
                    style={styles.buttonGradient}
                  >
                    {loading ? (
                      <ActivityIndicator color="#FFFFFF" />
                    ) : (
                      <>
                        <Icon name="send" size={20} color="#FFFFFF" />
                        <Text style={styles.primaryButtonText}>{t.send}</Text>
                      </>
                    )}
                  </LinearGradient>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.secondaryButton}
                  onPress={() => {
                    Keyboard.dismiss();
                    navigation.navigate("OnlineTabs");
                  }}
                  activeOpacity={0.85}
                >
                  <View style={styles.secondaryIconBox}>
                    <Icon name="home-outline" size={22} color="#00D2FF" />
                  </View>

                  <Text style={styles.secondaryButtonText}>{t.homePage}</Text>
                  <Text style={styles.arrow}>›</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  safe: { flex: 1 },
  keyboard: { flex: 1 },

  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 28,
    paddingBottom: 28,
    justifyContent: "center",
  },

  glowOne: {
    position: "absolute",
    width: 270,
    height: 270,
    borderRadius: 135,
    backgroundColor: "rgba(108,92,231,0.34)",
    top: -90,
    right: -110,
  },

  glowTwo: {
    position: "absolute",
    width: 230,
    height: 230,
    borderRadius: 115,
    backgroundColor: "rgba(0,210,255,0.18)",
    bottom: 80,
    left: -105,
  },

  header: {
    alignItems: "center",
    marginBottom: 28,
  },

  logo: {
    fontSize: 40,
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

  card: {
    width: "100%",
    borderRadius: 30,
    padding: 18,
    backgroundColor: "rgba(255,255,255,0.08)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.16)",
  },

  iconBadge: {
    alignSelf: "center",
    width: 82,
    height: 82,
    borderRadius: 28,
    backgroundColor: "rgba(0,210,255,0.12)",
    borderWidth: 1,
    borderColor: "rgba(0,210,255,0.30)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },

  title: {
    fontSize: 27,
    fontWeight: "900",
    color: "#FFFFFF",
    textAlign: "center",
  },

  subtitle: {
    marginTop: 8,
    marginBottom: 20,
    fontSize: 14,
    color: "#D8D8F0",
    textAlign: "center",
    fontWeight: "700",
    lineHeight: 20,
  },

  inputWrapper: {
    borderRadius: 22,
    padding: 14,
    backgroundColor: "rgba(255,255,255,0.07)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.16)",
  },

  input: {
    minHeight: 130,
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "700",
    lineHeight: 21,
  },

  counterRow: {
    marginTop: 8,
    alignSelf: "flex-end",
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },

  counter: {
    fontSize: 12,
    color: "#AFAFD1",
    fontWeight: "900",
  },

  primaryButton: {
    marginTop: 18,
    borderRadius: 22,
    overflow: "hidden",
  },

  disabledButton: {
    opacity: 0.65,
  },

  buttonGradient: {
    paddingVertical: 17,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 8,
  },

  primaryButtonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "900",
  },

  secondaryButton: {
    minHeight: 62,
    borderRadius: 22,
    marginTop: 13,
    backgroundColor: "rgba(255,255,255,0.07)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.15)",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
  },

  secondaryIconBox: {
    width: 42,
    height: 42,
    borderRadius: 15,
    backgroundColor: "rgba(0,210,255,0.12)",
    borderWidth: 1,
    borderColor: "rgba(0,210,255,0.28)",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },

  secondaryButtonText: {
    flex: 1,
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "900",
  },

  arrow: {
    color: "#00D2FF",
    fontSize: 31,
    fontWeight: "700",
  },
});