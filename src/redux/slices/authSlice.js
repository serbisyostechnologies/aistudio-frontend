import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null,
  token: null,
  isLoggedIn: false,
  fcmToken: null,
  deviceId: null,
  credits: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginSuccess: (state, action) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isLoggedIn = true;
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isLoggedIn = false;
    },
    removeToken: (state) => {
      state.token = null;
    },
    updateProfilePhotoUrl: (state, action) => {
      state.user.profile_url = action.payload;
    },
    removeProfilePhotoUrl: (state, action) => {
      state.user.profile_url = action.payload;
    },
    updateFcmToken: (state, action) => {
      state.fcmToken = action.payload;
    },
    updateDeviceId: (state, action) => {
      state.deviceId = action.payload;
    },
    updateCredits: (state, action) => {
      state.credits = action.payload;
    }
  },
});

export const { loginSuccess, logout, removeToken, updateProfilePhotoUrl, removeProfilePhotoUrl, updateFcmToken, updateDeviceId, updateCredits } = authSlice.actions;
export default authSlice.reducer;