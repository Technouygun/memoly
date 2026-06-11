import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

import FirstOnline from "../../Screens/Online/Screens/FirstOnline";
import OnlineList from "../../Screens/Online/Screens/OnlineList";
import FirstFriend from "../../Screens/Online/Screens/Friend/FirstFriend";
/* import OnlineStore from "../../Screens/Online/Screens/OnlineStore"; */

const Tab = createBottomTabNavigator();

export default function OnlineTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: styles.tabBar,
        tabBarItemStyle: styles.tabItem,
        tabBarBackground: () => (
          <View style={styles.tabBackground}>
            <LinearGradient
              colors={[
                "rgba(7,7,18,0.98)",
                "rgba(16,16,53,0.96)",
                "rgba(23,23,83,0.94)",
              ]}
              style={styles.tabGradient}
            />
          </View>
        ),
        tabBarIcon: ({ focused }) => {
          let iconName: any = "home";
          let label = "Anasayfa";

          if (route.name === "OnlineHome") {
            iconName = "home-variant";
            label = "Anasayfa";
          }

          if (route.name === "OnlineList") {
            iconName = "podium-gold";
            label = "Sıralama";
          }

          if (route.name === "FirstFriend") {
            iconName = "account-group";
            label = "Arkadaşım";
          }

          if (route.name === "OnlineStore") {
            iconName = "storefront";
            label = "Market";
          }

          return (
            <View style={styles.iconWrapper}>
              {focused ? (
                <LinearGradient
                  colors={["#8E7CFF", "#6C5CE7", "#00D2FF"]}
                  style={styles.activeIconBox}
                >
                  <MaterialCommunityIcons
                    name={iconName}
                    size={25}
                    color="#FFFFFF"
                  />
                </LinearGradient>
              ) : (
                <View style={styles.passiveIconBox}>
                  <MaterialCommunityIcons
                    name={iconName}
                    size={23}
                    color="#AFAFD1"
                  />
                </View>
              )}

              <Text style={[styles.label, focused && styles.activeLabel]}>
                {label}
              </Text>
            </View>
          );
        },
      })}
    >
      <Tab.Screen name="OnlineHome" component={FirstOnline} />

      <Tab.Screen name="OnlineList" component={OnlineList} />

      <Tab.Screen name="FirstFriend" component={FirstFriend} />

      {/* 
      <Tab.Screen name="OnlineStore" component={OnlineStore} />
      */}
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    position: "absolute",
    left: 18,
    right: 18,
    bottom: 18,
    height: 82,
    borderRadius: 32,
    borderTopWidth: 0,
    backgroundColor: "transparent",
    elevation: 18,
    shadowColor: "#00D2FF",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.24,
    shadowRadius: 18,
  },

  tabBackground: {
    flex: 1,
    borderRadius: 32,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.16)",
  },

  tabGradient: {
    flex: 1,
    borderRadius: 32,
  },

  tabItem: {
    height: 82,
    paddingTop: 9,
  },

  iconWrapper: {
    width: 82,
    alignItems: "center",
    justifyContent: "center",
  },

  activeIconBox: {
    width: 46,
    height: 36,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 4,
    shadowColor: "#00D2FF",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 8,
  },

  passiveIconBox: {
    width: 46,
    height: 36,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 4,
    backgroundColor: "rgba(255,255,255,0.04)",
  },

  label: {
    color: "#AFAFD1",
    fontSize: 10,
    fontWeight: "900",
  },

  activeLabel: {
    color: "#FFFFFF",
  },
});