import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import HomeScreen from "../../Screens/HomeScreen";
import GameScreen from "../../Screens/GameScreen";
import OfflineModesScreen from "../../Screens/Offline/OflineFirst";
import LocalMultiplayerScreen from "../../Screens/Offline/MultiPlayer/LocalMultiplayerScreen";
import ExerciseFirst from "../../Screens/Offline/Egzersiz/ExerciseFirst";
import SequenceMemoryScreen from "../../Screens/Offline/Egzersiz/Games/SequenceMemoryScreen";
import FlashMemoryScreen from "../../Screens/Offline/Egzersiz/Games/FlashMemoryScreen";
import NumberMemoryScreen from "../../Screens/Offline/Egzersiz/Games/NumberMemoryScreen";


export type RootStackParamList = {
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

};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="HomeScreen"
        screenOptions={{
          headerShown: false,
          gestureEnabled: false,
        }}
      >
        <Stack.Screen name="HomeScreen" component={HomeScreen} />


        <Stack.Screen name="GameScreen" component={GameScreen} />

        <Stack.Screen
          name="OfflineModesScreen"
          component={OfflineModesScreen}
        />

        <Stack.Screen
          name="LocalMultiplayerScreen"
          component={LocalMultiplayerScreen}
        />

<Stack.Screen
          name="FlashMemoryScreen"
          component={FlashMemoryScreen}
        />

<Stack.Screen
          name="NumberMemoryScreen"
          component={NumberMemoryScreen}
        />

        <Stack.Screen name="ExerciseFirst" component={ExerciseFirst} />

        <Stack.Screen name="SequenceMemoryScreen" component={SequenceMemoryScreen}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
}