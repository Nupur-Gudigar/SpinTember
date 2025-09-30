import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isMuted: false,
  volume: 0.5,
};

const audioSlice = createSlice({
  name: "audio",
  initialState,
  reducers: {
    toggleMute: (state) => {
      state.isMuted = !state.isMuted;
    },
    setMute: (state, action) => {
      state.isMuted = action.payload;
    },
    setVolume: (state, action) => {
      state.volume = Math.max(0, Math.min(1, action.payload));
    },
  },
});

export const { toggleMute, setMute, setVolume } = audioSlice.actions;
export default audioSlice.reducer;