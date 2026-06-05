import React from "react";
import useNetworkStatus from "../hooks/useNetworkStatus";
import AppNavigator from "../navigation/AppNavigator";

export default function AppProviders() {
  useNetworkStatus();

  return <AppNavigator />;
}