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


import FirstCaylak from "../../Screens/Online/Screens/Caylak/FirstCaylak";
import CaylakLigi from "../../Screens/Online/Screens/Caylak/CaylakLigi";

import CaylakDrawScreen from "../../Screens/Online/Screens/Caylak/Game/CaylakDrawScreen";
import CaylakLoseScreen from "../../Screens/Online/Screens/Caylak/Game/CaylakLoseScreen";
import CaylakGameScreen from "../../Screens/Online/Screens/Caylak/Game/CaylakGameScreen";
import CaylakWinScreen from "../../Screens/Online/Screens/Caylak/Game/CaylakWinScreen";


import UstaGameScreen from "../../Screens/Online/Screens/Usta/Game/UstaGameScreen";
import UstaLoseScreen from "../../Screens/Online/Screens/Usta/Game/UstaLoseScreen";
import UstaWinScreen from "../../Screens/Online/Screens/Usta/Game/UstaWinScreen";
import UstaDrawScreen from "../../Screens/Online/Screens/Usta/Game/UstaDrawScreen";

import FirstUsta from "../../Screens/Online/Screens/Usta/FirstUsta";
import UstaLigi from "../../Screens/Online/Screens/Usta/UstaLigi";

import HafizaGameScreen from "../../Screens/Online/Screens/Hafiza/Game/HafizaGameScreen";
import HafizaDrawScreen from "../../Screens/Online/Screens/Hafiza/Game/HafizaDrawScreen";
import HafizaLoseScreen from "../../Screens/Online/Screens/Hafiza/Game/HafizaLoseScreen";
import HafizaWinScreen from "../../Screens/Online/Screens/Hafiza/Game/HafizaWinScreen";

import FirstHafiza from "../../Screens/Online/Screens/Hafiza/FirstHafiza";
import HafizaLigi from "../../Screens/Online/Screens/Hafiza/HafizaLigi";

import ZihinGameScreen from "../../Screens/Online/Screens/Zihin/Game/ZihinGameScreen";
import ZihinDrawScreen from "../../Screens/Online/Screens/Zihin/Game/ZihinDrawScreen";
import ZihinLoseScreen from "../../Screens/Online/Screens/Zihin/Game/ZihinLoseScreen";
import ZihinWinScreen from "../../Screens/Online/Screens/Zihin/Game/ZihinWinScreen";

import ZihinLigi from "../../Screens/Online/Screens/Zihin/ZihinLigi";
import FirstZihin from "../../Screens/Online/Screens/Zihin/FirstZihin";

import FirstZihinFinal from "../../Screens/Online/Screens/Final/FirstZihinFinal";
import ZihinFinalLigi from "../../Screens/Online/Screens/Final/ZihinFinalLigi";
import ZihinFinalDrawScreen from "../../Screens/Online/Screens/Final/Game/ZihinFinalDrawScreen";
import ZihinFinalLoseScreen from "../../Screens/Online/Screens/Final/Game/ZihinFinalLoseScreen";
import ZihinFinalWinScreen from "../../Screens/Online/Screens/Final/Game/ZihinFinalWinScreen";
import ZihinFinalGameScreen from "../../Screens/Online/Screens/Final/Game/ZihinFinalGameScreen";

import ProfileScreen from "../../Screens/Online/Screens/ProfilScreen";

import FeedBack from "../../Screens/Online/Screens/FeeedBack";  

import FirstFriend from "../../Screens/Online/Screens/Friend/FirstFriend";

import FriendLig from "../../Screens/Online/Screens/Friend/FriendLig";

import BasitFriendGame from "../../Screens/Online/Screens/Friend/Basit/Game/BasitFrendGame";
import BasitFriendLoseScreen from "../../Screens/Online/Screens/Friend/Basit/Game/BasitFriendLoseScreen";
import BasitFriendWinScreen from "../../Screens/Online/Screens/Friend/Basit/Game/BasitFriendWinScreen";
import BasitFriendDrawScreen from "../../Screens/Online/Screens/Friend/Basit/Game/BasitFriendDrawScreen";

import FirstBasitFriend from "../../Screens/Online/Screens/Friend/Basit/FirstBasitFriend";

import FirstOrtaFriend from "../../Screens/Online/Screens/Friend/Orta/FirstOrtaFriend";
import OrtaFriendGame from "../../Screens/Online/Screens/Friend/Orta/Game/OrtaFriendGame";
import OrtaFriendLoseScreen from "../../Screens/Online/Screens/Friend/Orta/Game/OrtaFriendLoseScreen";
import OrtaFriendWinScreen from "../../Screens/Online/Screens/Friend/Orta/Game/OrtaFriendWinScreen";
import OrtaFriendDrawScreen from "../../Screens/Online/Screens/Friend/Orta/Game/OrtaFriendDrawScreen";

import FirstZorFriend from "../../Screens/Online/Screens/Friend/Zor/FirstZorFriend";
import ZorFriendGame from "../../Screens/Online/Screens/Friend/Zor/Game/ZorFriendGame";
import ZorFriendLoseScreen from "../../Screens/Online/Screens/Friend/Zor/Game/ZorFriendLoseScreen";
import ZorFriendWinScreen from "../../Screens/Online/Screens/Friend/Zor/Game/ZorFriendWinScreen";
import ZorFriendDrawScreen from "../../Screens/Online/Screens/Friend/Zor/Game/ZorFriendDrawScreen";

import LanguageScreen from "../../Screens/Settings/LanguageScreen";

import SplashScreen from "../../SplashScreen";


import OnlineTabs from "./OnlineTabs";
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

  FirstCaylak: undefined;
  CaylakLigi: undefined;
  CaylakDrawScreen: undefined;
  CaylakWinScreen: undefined;
  CaylakLoseScreen: undefined;
  CaylakGameScreen: undefined;
  FirstUsta: undefined;
  UstaLigi: undefined;
  UstaDrawScreen: undefined;
  UstaWinScreen: undefined;
  UstaLoseScreen: undefined;
  UstaGameScreen: undefined;
  HafizaGameScreen: undefined;
  HafizaDrawScreen: undefined;
  HafizaLoseScreen: undefined;
  HafizaWinScreen: undefined;
  FirstHafiza: undefined;
  HafizaLigi: undefined;
  FirstZihin: undefined;
  ZihinLigi: undefined;
  ZihinDrawScreen: undefined;
  ZihinLoseScreen: undefined;
  ZihinWinScreen: undefined;
  ZihinGameScreen: undefined;
  FirstZihinFinal: undefined;
  ZihinFinalLigi: undefined;
  ZihinFinalDrawScreen: undefined;
  ZihinFinalLoseScreen: undefined;
  ZihinFinalWinScreen: undefined;
  ZihinFinalGameScreen: undefined;  
  ProfileScreen: undefined;
  FeedBack: undefined;
  OnlineTabs: undefined;
  FirstFriend: undefined;
  FriendLig: undefined;
  BasitFriendGame: undefined;
  BasitFriendLoseScreen: undefined;
  BasitFriendWinScreen: undefined;
  BasitFriendDrawScreen: undefined;
  FirstBasitFriend: undefined;
  FirstOrtaFriend: undefined;
  OrtaFriendGame: undefined;
  OrtaFriendLoseScreen: undefined;
  OrtaFriendWinScreen: undefined;
  OrtaFriendDrawScreen: undefined;
  FirstZorFriend: undefined;
  ZorFriendGame: undefined;
  ZorFriendLoseScreen: undefined;
  ZorFriendWinScreen: undefined;
  ZorFriendDrawScreen: undefined;
  LanguageScreen: undefined;
  SplashScreen: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="SplashScreen"
        screenOptions={{
          headerShown: false,
          gestureEnabled: false,
        }}
      >
         <Stack.Screen name="SplashScreen" component={SplashScreen} />
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



        <Stack.Screen name="FirstCaylak" component={FirstCaylak} />
        <Stack.Screen name="CaylakLigi" component={CaylakLigi} />


        <Stack.Screen name="CaylakDrawScreen" component={CaylakDrawScreen} />
        <Stack.Screen name="CaylakLoseScreen" component={CaylakLoseScreen} />
        <Stack.Screen name="CaylakWinScreen" component={CaylakWinScreen} />
        <Stack.Screen name="CaylakGameScreen" component={CaylakGameScreen} />

        <Stack.Screen name="FirstUsta" component={FirstUsta} />
        <Stack.Screen name="UstaLigi" component={UstaLigi} />
        <Stack.Screen name="UstaDrawScreen" component={UstaDrawScreen} />
        <Stack.Screen name="UstaWinScreen" component={UstaWinScreen} />
        <Stack.Screen name="UstaLoseScreen" component={UstaLoseScreen} />
        <Stack.Screen name="UstaGameScreen" component={UstaGameScreen} />

        <Stack.Screen name="HafizaGameScreen" component={HafizaGameScreen} />
        <Stack.Screen name="HafizaDrawScreen" component={HafizaDrawScreen} />
        <Stack.Screen name="HafizaLoseScreen" component={HafizaLoseScreen} />
        <Stack.Screen name="HafizaWinScreen" component={HafizaWinScreen} />
        <Stack.Screen name="FirstHafiza" component={FirstHafiza} />
        <Stack.Screen name="HafizaLigi" component={HafizaLigi} />
      
        <Stack.Screen name="FirstZihin" component={FirstZihin} />
        <Stack.Screen name="ZihinLigi" component={ZihinLigi} />
        <Stack.Screen name="ZihinDrawScreen" component={ZihinDrawScreen} />
        <Stack.Screen name="ZihinLoseScreen" component={ZihinLoseScreen} />
        <Stack.Screen name="ZihinWinScreen" component={ZihinWinScreen} />
        <Stack.Screen name="ZihinGameScreen" component={ZihinGameScreen} />

        <Stack.Screen name="FirstZihinFinal" component={FirstZihinFinal} />
        <Stack.Screen name="ZihinFinalLigi" component={ZihinFinalLigi} />
        <Stack.Screen name="ZihinFinalDrawScreen" component={ZihinFinalDrawScreen} />
        <Stack.Screen name="ZihinFinalLoseScreen" component={ZihinFinalLoseScreen} />
        <Stack.Screen name="ZihinFinalWinScreen" component={ZihinFinalWinScreen} />
        <Stack.Screen name="ZihinFinalGameScreen" component={ZihinFinalGameScreen} />

        <Stack.Screen name="ProfileScreen" component={ProfileScreen} />
        <Stack.Screen name="FeedBack" component={FeedBack} />
        <Stack.Screen name="OnlineTabs" component={OnlineTabs} />
        <Stack.Screen name="FirstFriend" component={FirstFriend} />
        <Stack.Screen name="FriendLig" component={FriendLig} />
        <Stack.Screen name="BasitFriendGame" component={BasitFriendGame} />
        <Stack.Screen name="BasitFriendLoseScreen" component={BasitFriendLoseScreen} />
        <Stack.Screen name="BasitFriendWinScreen" component={BasitFriendWinScreen} />
        <Stack.Screen name="BasitFriendDrawScreen" component={BasitFriendDrawScreen} />
        <Stack.Screen name="FirstBasitFriend" component={FirstBasitFriend} />
        <Stack.Screen name="FirstOrtaFriend" component={FirstOrtaFriend} />
        <Stack.Screen name="OrtaFriendGame" component={OrtaFriendGame} />
        <Stack.Screen name="OrtaFriendLoseScreen" component={OrtaFriendLoseScreen} />
        <Stack.Screen name="OrtaFriendWinScreen" component={OrtaFriendWinScreen} />
        <Stack.Screen name="OrtaFriendDrawScreen" component={OrtaFriendDrawScreen} />
        <Stack.Screen name="FirstZorFriend" component={FirstZorFriend} />
        <Stack.Screen name="ZorFriendGame" component={ZorFriendGame} />
        <Stack.Screen name="ZorFriendLoseScreen" component={ZorFriendLoseScreen} />
        <Stack.Screen name="ZorFriendWinScreen" component={ZorFriendWinScreen} />
        <Stack.Screen name="ZorFriendDrawScreen" component={ZorFriendDrawScreen} />
        <Stack.Screen name="LanguageScreen" component={LanguageScreen} />



      </Stack.Navigator>
    </NavigationContainer>
  );
}