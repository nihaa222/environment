import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  initiative: null,
  error: null,
  loading: null,
};

const initiativeSlice = createSlice({
  name: "initiative",
  initialState,
  reducers: {
    setInitiativeStart: (state) => {
      state.loading = true;
      state.error = null;
      state.initiative = null;
    },
    setInitiativeSuccess: (state, action) => {
      state.initiative = action.payload;
      state.error = null;
      state.loading = null;
    },
    setInitiativeFailure: (state, action) => {
      state.error = action.payload;
      state.loading = null;
    },
  },
});

export const {
  setInitiativeFailure,
  setInitiativeSuccess,
  setInitiativeStart,
} = initiativeSlice.actions;
export default initiativeSlice.reducer;
