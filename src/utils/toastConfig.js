import React from "react";
import { BaseToast, ErrorToast } from "react-native-toast-message";
import { globalStyles, colors, fonts } from '../styles/globalStyles';

export const toastConfig = {
  success: (props) => (
    <BaseToast
      {...props}
      style={{
        borderLeftColor: "#22c55e",
        height: 40,
      }}
      text1Style={{
        fontSize: 14,
        fontWeight: 'normal',
        fontFamily: fonts.regular
      }}
    />
  ),

  error: (props) => (
    <ErrorToast
      {...props}
      style={{
        borderLeftColor: "#ef4444",
        height: "auto",
        minHeight: 40,
      }}
      text1Style={{
        fontSize: 14,
        fontWeight: 'normal',
        fontFamily: fonts.regular
      }}
    />
  ),

  info: (props) => (
    <BaseToast
      {...props}
      style={{
        borderLeftColor: "#3b82f6",
        height: 40,
      }}
      text1Style={{
        fontSize: 14,
        fontWeight: 'normal',
        fontFamily: fonts.regular
      }}
    />
  ),
};