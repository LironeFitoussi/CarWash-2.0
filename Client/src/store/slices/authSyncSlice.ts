import { createSlice } from '@reduxjs/toolkit';
import { fetchUserByEmail } from './userSlice';

interface AuthSyncState {
  isInitialSyncComplete: boolean;
}

const initialState: AuthSyncState = {
  isInitialSyncComplete: false,
};

const authSyncSlice = createSlice({
  name: 'authSync',
  initialState,
  reducers: {
    resetSync: (state) => {
      state.isInitialSyncComplete = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserByEmail.fulfilled, (state) => {
        state.isInitialSyncComplete = true;
      });
  },
});

export const { resetSync } = authSyncSlice.actions;
export default authSyncSlice.reducer; 