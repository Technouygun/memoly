import { useState } from "react";

import HomeScreen from "../../Screens/HomeScreen";
import GameScreen from "../../Screens/GameScreen";
import OfflineModesScreen from "../../Screens/Offline/OflineFirst";
import LocalMultiplayerScreen from "../../Screens/Offline/MultiPlayer/LocalMultiplayerScreen";
type BoardSize = "4x4" | "4x5" | "4x6" | "5x6";
type PlayerCount = 2 | 3 | 4;

type ScreenType =
  | "home"
  | "onlineGame"
  | "offlineModes"
  | "localMultiplayer"
  | "exercise"
  | "settings";

export default function AppNavigator() {
  const [screen, setScreen] = useState<ScreenType>("home");

  const [boardSize, setBoardSize] = useState<BoardSize>("4x4");
  const [playerCount, setPlayerCount] = useState<PlayerCount>(2);

  return (
    <>
      {screen === "home" && (
        <HomeScreen
          onOnlinePlay={() => setScreen("onlineGame")}
          onOfflineModes={() => setScreen("offlineModes")}
          onSettings={() => setScreen("settings")}
        />
      )}

      {screen === "onlineGame" && (
        <GameScreen onBack={() => setScreen("home")} />
      )}

      {screen === "offlineModes" && (
        <OfflineModesScreen
          onLocalMultiplayer={() => setScreen("localMultiplayer")}
          onExercise={() => setScreen("exercise")}
          onHome={() => setScreen("home")}
        />
      )}

      {screen === "localMultiplayer" && (
        <LocalMultiplayerScreen
          onBack={() => setScreen("offlineModes")}
          onStartGame={(selectedBoardSize, selectedPlayerCount) => {
            setBoardSize(selectedBoardSize);
            setPlayerCount(selectedPlayerCount);
            setScreen("exercise");
          }}
        />
      )}

      {screen === "exercise" && (
        <GameScreen
          onBack={() => setScreen("offlineModes")}
          boardSize={boardSize}
          playerCount={playerCount}
        />
      )}
    </>
  );
}