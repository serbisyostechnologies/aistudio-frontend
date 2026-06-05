import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { NavigationContainer } from "@react-navigation/native";

import AppNavigator from "./AppNavigator";
import NetworkErrorScreen from "../screens/utilities/NetworkErrorScreen";

export default function RootNavigator() {
  const isConnected = useSelector((state) => state.network.isConnected);

  return (
    <NavigationContainer>
      {isConnected ? <AppNavigator /> : <NetworkErrorScreen />}
    </NavigationContainer>
  );
}