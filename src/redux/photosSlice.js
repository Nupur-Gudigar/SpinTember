
import { createSlice } from "@reduxjs/toolkit";

const photosSlice = createSlice({
  name: "photos",
  initialState: [],
  reducers: {
    addPhoto: (state, action) => {
      // action.payload = { image: base64, task: string, adventureType: string }
      // Add unique ID for deletion
      const photoWithId = {
        ...action.payload,
        id: Date.now() + Math.random(), // Simple unique ID
        timestamp: new Date().toISOString()
      };
      state.push(photoWithId);
    },
    deletePhoto: (state, action) => {
      // action.payload = photo ID to delete
      return state.filter(photo => photo.id !== action.payload);
    },
    clearPhotos: () => {
      return [];
    },
  },
});

export const { addPhoto, deletePhoto, clearPhotos } = photosSlice.actions;
export default photosSlice.reducer;
