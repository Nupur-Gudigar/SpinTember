import { configureStore } from "@reduxjs/toolkit";
import photosReducer from "./photosSlice";
import audioReducer from "./audioSlice";

const store = configureStore({
  reducer: {
    photos: photosReducer,
    audio: audioReducer,
  },
});

export default store;
