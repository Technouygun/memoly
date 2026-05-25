import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import AuthChoiceScreen from "../../Screens/Online/Auth/AuthChoiceScreen";
import GuestRegisterScreen from "../../Screens/Online/Auth/GuestRegisterScreen";
import EmailRegisterScreen from "../../Screens/Online/Auth/EmailRegisterScreen";
import LoginScreen from "../../Screens/Online/Auth/LoginScreen";
import HomeScreen from "../../Screens/HomeScreen";
import GameScreen from "../../Screens/GameScreen";
import OfflineModesScreen from "../../Screens/Offline/OflineFirst";
import LocalMultiplayerScreen from "../../Screens/Offline/MultiPlayer/LocalMultiplayerScreen";
import ExerciseFirst from "../../Screens/Offline/Egzersiz/ExerciseFirst";
import SequenceMemoryScreen from "../../Screens/Offline/Egzersiz/Games/SequenceMemoryScreen";
import FlashMemoryScreen from "../../Screens/Offline/Egzersiz/Games/FlashMemoryScreen";
import NumberMemoryScreen from "../../Screens/Offline/Egzersiz/Games/NumberMemoryScreen";
import FirstOnline from "../../Screens/Online/Screens/FirstOnline";

import FirstCaylak from "../../Screens/Online/Screens/Caylak/FirstCaylak";
import CaylakLigi from "../../Screens/Online/Screens/Caylak/CaylakLigi";

import CaylakDrawScreen from "../../Screens/Online/Screens/Caylak/Game/CaylakDrawScreen";
import CaylakLoseScreen from "../../Screens/Online/Screens/Caylak/Game/CaylakLoseScreen";
import CaylakGameScreen from "../../Screens/Online/Screens/Caylak/Game/CaylakGameScreen";
import CaylakWinScreen from "../../Screens/Online/Screens/Caylak/Game/CaylakWinScreen";




export type RootStackParamList = {
  AuthChoiceScreen: undefined;
  GuestRegisterScreen: undefined;
  EmailRegisterScreen: undefined;

  HomeScreen: undefined;

  GameScreen: {
    boardSize?: "4x4" | "4x5" | "4x6" | "5x6";
    playerCount?: 2 | 3 | 4;
  };

  OfflineModesScreen: undefined;
  LocalMultiplayerScreen: undefined;
  ExerciseFirst: undefined;
  SequenceMemoryScreen: undefined;
  FlashMemoryScreen: undefined;
  NumberMemoryScreen: undefined;
  LoginScreen: undefined;
  FirstOnline: undefined;
  FirstCaylak: undefined;
  CaylakLigi: undefined;
  CaylakDrawScreen: undefined;
  CaylakWinScreen: undefined;
  CaylakLoseScreen: undefined;
  CaylakGameScreen: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="AuthChoiceScreen"
        screenOptions={{
          headerShown: false,
          gestureEnabled: false,
        }}
      >
        <Stack.Screen name="AuthChoiceScreen" component={AuthChoiceScreen} />
        <Stack.Screen name="GuestRegisterScreen" component={GuestRegisterScreen} />
        <Stack.Screen name="EmailRegisterScreen" component={EmailRegisterScreen} />

        <Stack.Screen name="HomeScreen" component={HomeScreen} />
        <Stack.Screen name="GameScreen" component={GameScreen} />
        <Stack.Screen name="LoginScreen" component={LoginScreen} />

        <Stack.Screen name="OfflineModesScreen" component={OfflineModesScreen} />
        <Stack.Screen name="LocalMultiplayerScreen" component={LocalMultiplayerScreen} />

        <Stack.Screen name="ExerciseFirst" component={ExerciseFirst} />
        <Stack.Screen name="SequenceMemoryScreen" component={SequenceMemoryScreen} />
        <Stack.Screen name="FlashMemoryScreen" component={FlashMemoryScreen} />
        <Stack.Screen name="NumberMemoryScreen" component={NumberMemoryScreen} />
        <Stack.Screen name="FirstOnline" component={FirstOnline} />


        <Stack.Screen name="FirstCaylak" component={FirstCaylak} />
        <Stack.Screen name="CaylakLigi" component={CaylakLigi} />


        <Stack.Screen name="CaylakDrawScreen" component={CaylakDrawScreen} />
        <Stack.Screen name="CaylakLoseScreen" component={CaylakLoseScreen} />
        <Stack.Screen name="CaylakWinScreen" component={CaylakWinScreen} />
        <Stack.Screen name="CaylakGameScreen" component={CaylakGameScreen} />

      </Stack.Navigator>
    </NavigationContainer>
  );
}