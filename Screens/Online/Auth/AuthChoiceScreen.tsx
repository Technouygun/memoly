import React from "react";
import {
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../../app/navigation/types";

type Nav = NativeStackNavigationProp<RootStackParamList, "AuthChoiceScreen">;

export default function AuthChoiceScreen() {
  const navigation = useNavigation<Nav>();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Memoly</Text>
        <Text style={styles.subtitle}>Oyuna nasıl giriş yapmak istersin?</Text>
<TouchableOpacity
  style={styles.primaryButton}
  onPress={() => navigation.navigate("GuestRegisterScreen")}
>
  <Text style={styles.primaryText}>Misafir Olarak Gir</Text>
</TouchableOpacity>

<TouchableOpacity
  style={styles.secondaryButton}
  onPress={() => navigation.navigate("EmailRegisterScreen")}
>
  <Text style={styles.secondaryText}>Mail ile Kayıt Ol</Text>
</TouchableOpacity>

<TouchableOpacity
  style={styles.loginButton}
  onPress={() => navigation.navigate("LoginScreen")}
>
  <Text style={styles.loginText}>Giriş Yap</Text>
</TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#111827",
    justifyContent: "center",
    padding: 24,
  },
  card: {
    backgroundColor: "#1f2937",
    borderRadius: 24,
    padding: 24,
  },
  title: {
    fontSize: 38,
    fontWeight: "900",
    color: "#fff",
    textAlign: "center",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: "#d1d5db",
    textAlign: "center",
    marginBottom: 32,
  },
  primaryButton: {
    backgroundColor: "#22c55e",
    padding: 16,
    borderRadius: 16,
    marginBottom: 14,
  },
  primaryText: {
    color: "#fff",
    fontSize: 17,
    fontWeight: "800",
    textAlign: "center",
  },
  secondaryButton: {
    borderWidth: 1,
    borderColor: "#60a5fa",
    padding: 16,
    borderRadius: 16,
  },
  secondaryText: {
    color: "#60a5fa",
    fontSize: 17,
    fontWeight: "800",
    textAlign: "center",
  },
  loginButton: {
  marginTop: 14,
  padding: 14,
  borderRadius: 16,
  backgroundColor: "#374151",
},

loginText: {
  color: "#fff",
  textAlign: "center",
  fontSize: 16,
  fontWeight: "800",
},
});