import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface SettingState {
  language: string;
}

const initialState: SettingState = {
  language: "bn",
};

const settingSlice = createSlice({
  name: "session",
  initialState,
  reducers: {
    setLanguage(state, action) {
      state.language = action.payload;
    },
  },
  extraReducers: (builder) => {},
});

export const { setLanguage } = settingSlice.actions;

export default settingSlice.reducer;
