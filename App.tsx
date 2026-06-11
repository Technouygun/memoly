import React from "react";
import { ActivityIndicator, View } from "react-native";
import AppNavigator from "./app/navigation/AppNavigator";
import LanguageStartScreen from "./Screens/language/LanguageStartScreen";
import {
  LanguageProvider,
  useLanguage,
} from "./Screens/language/LanguageContext";

function RootGate() {
  const { isLanguageReady, selectedLanguage } = useLanguage();

  if (!isLanguageReady) {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: "#101827",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <ActivityIndicator size="large" color="#fff" />
      </View>
    );
  }

  if (!selectedLanguage) {
    return <LanguageStartScreen />;
  }

  return <AppNavigator />;
}

export default function App() {
  return (
    <LanguageProvider>
      <RootGate />
    </LanguageProvider>
  );
}