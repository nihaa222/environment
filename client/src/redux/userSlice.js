import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  currentUser: null,
  loading: false,
  error: null,
  initiativeDetail: [],
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    signInStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    signInSuccess: (state, action) => {
      state.currentUser = action.payload;
      state.loading = false;
      state.error = null;
    },
    signInFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    updateStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    updateSuccess: (state, action) => {
      state.currentUser = action.payload;
      state.loading = false;
      state.error = null;
    },
    updateFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    signoutSuccess: (state) => {
      state.currentUser = "";
      (state.error = null), (state.loading = false);
    },
    initiativeJoined: (state, action) => {
      state.currentUser.joinedInitiativeId.push(action.payload);
    },
    initiativeJoinedRemoved: (state, action) => {
      state.currentUser.joinedInitiativeId =
        state.currentUser.joinedInitiativeId.filter(
          (initiative) => initiative !== action.payload
        );
    },
    removeLocation: (state, action) => {
      console.log("Removing location with payload:", action.payload);
      state.location = action.payload;
    },
    addInitoUser: (state, action) => {
      state.currentUser.initiatives.push(action.payload);
    },
    deleteInitiative: (state, action) => {
      const idToDelete = action.payload;
      state.currentUser.initiatives = state.currentUser.initiatives.filter(
        (initiative) => initiative !== idToDelete
      );
    },
    addInitoDetail: (state, action) => {
      state.initiativeDetail.push(action.payload);
    },
  },
});

export const {
  deleteInitiative,
  addInitoDetail,
  signInStart,
  addInitoUser,
  signInFailure,
  signInSuccess,
  removeLocation,
  updateFailure,
  updateStart,
  updateSuccess,
  signoutSuccess,
  initiativeJoined,
  initiativeJoinedRemoved,
} = userSlice.actions;

export default userSlice.reducer;
