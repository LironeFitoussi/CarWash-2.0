import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import * as userService from '@/api/userService';
import { AxiosError } from 'axios';

// Extend the User interface from userService
interface UserState {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  role: string;
  isLoading: boolean;
  error: string | null;
  // Add any other user properties you need
}

const initialState: UserState = {
  id: '',
  email: '',
  firstName: '',
  lastName: '',
  phone: '',
  address: '',
  city: '',
  state: '',
  zip: '',
  role: '',
  isLoading: false,
  error: null,
};

// Async thunk for fetching user data
export const fetchUserByEmail = createAsyncThunk(
  'user/fetchByEmail',
  async (userData: { email: string; firstName: string; lastName: string }, { rejectWithValue }) => {
    // console.log('Starting fetchUserByEmail:', userData.email);
    try {
      const response = await userService.getUserByEmail(userData.email);
      // console.log('User data fetched:', response);
      return response;
    } catch (error) {
      console.log('Error in fetchUserByEmail, creating new user');
      if (error instanceof AxiosError && error.response?.status === 404) {
        const newUser: Omit<UserState, 'isLoading' | 'error'> = {
          id: '', // Will be assigned by the backend
          email: userData.email,
          firstName: userData.firstName,
          lastName: userData.lastName,
          phone: '',
          address: '',
          city: '',
          state: '',
          zip: '',
          role: 'user',
        };
        
        const createdUser = await userService.createUser(newUser);
        console.log('New user created:', createdUser);
        return createdUser;
      }
      return rejectWithValue('Failed to fetch or create user');
    }
  }
);

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<Partial<UserState>>) => {
      console.log('Setting user state:', action.payload);
      return { ...state, ...action.payload };
    },
    resetUser: () => {
      console.log('Resetting user state');
      return initialState;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserByEmail.pending, (state) => {
        // console.log('fetchUserByEmail pending');
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchUserByEmail.fulfilled, (state, action) => {
        // console.log('fetchUserByEmail fulfilled:', action.payload);
        state.isLoading = false;
        // Map all properties from the response, handling _id -> id conversion
        state.id = action.payload._id || ''; // Map _id to id
        state.email = action.payload.email;
        state.firstName = action.payload.firstName;
        state.lastName = action.payload.lastName;
        state.phone = action.payload.phone;
        state.address = action.payload.address;
        state.city = action.payload.city;
        state.state = action.payload.state;
        state.zip = action.payload.zip;
        state.role = action.payload.role;
      })
      .addCase(fetchUserByEmail.rejected, (state, action) => {
        console.log('fetchUserByEmail rejected:', action.error);
        state.isLoading = false;
        state.error = action.error.message || 'Failed to fetch user data';
      });
  },
});

export const { setUser, resetUser } = userSlice.actions;
export default userSlice.reducer; 