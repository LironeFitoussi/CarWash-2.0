import { configureStore } from '@reduxjs/toolkit';
import userReducer from './slices/userSlice';
import authSyncReducer from './slices/authSyncSlice';

export const store = configureStore({
  reducer: {
    user: userReducer,
    authSync: authSyncReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch; 