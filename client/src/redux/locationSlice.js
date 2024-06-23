import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  country: "",
  city: "",
  locality: "",
  mapLat: "",
  mapLng: "",
};

const locationSlice = createSlice({
  name: "location",
  initialState,
  reducers: {
    setLocation: (state, action) => {
      const { country, city, locality, mapLat, mapLng } = action.payload;
      state.country = country;
      state.city = city;
      state.locality = locality;
      (state.mapLat = mapLat), (state.mapLng = mapLng);
    },
    setremoveLocation: (state, action) => {
      (state.country = action.payload.country),
        (state.city = action.payload.city),
        (state.locality = action.payload.locality),
        (state.mapLat = action.payload.mapLat),
        (state.mapLng = action.payload.mapLng);
    },
  },
});

export const { setLocation, setremoveLocation } = locationSlice.actions;
export default locationSlice.reducer;
