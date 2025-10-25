import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import * as authService from '@/services/authService'
import * as userService from '@/services/userService'
import type { UserData } from '@/shared/types'

interface AuthState {
  user: UserData | null
  token: string | null
  isAuthenticated: boolean
  loading: boolean
  error: string | null
}

const initialState: AuthState = {
  user: null,
  token: authService.getToken() || null,
  isAuthenticated: authService.isAuthenticated(),
  loading: false,
  error: null,
}

export const loginUser = createAsyncThunk('auth/login', async (data: authService.LoginRequest, { rejectWithValue }) => {
  try {
    const res = await authService.login(data)
    return res.token
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    return rejectWithValue(message)
  }
})

export const registerUser = createAsyncThunk(
  'auth/register',
  async (data: authService.RegisterRequest, { rejectWithValue }) => {
    try {
      const res = await authService.register(data)
      return res.token
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error'
      return rejectWithValue(message)
    }
  }
)

export const checkAuth = createAsyncThunk('auth/checkAuth', async (_, { rejectWithValue }) => {
  try {
    const user = await authService.getCurrentUser()
    return user
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    return rejectWithValue(message)
  }
})

export const deleteUserAccount = createAsyncThunk("user/deleteAccount", async (_, { rejectWithValue }) => {
  try {
    const user = await userService.deleteUserAccount();
    return user;
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    return rejectWithValue(message)
  }
})

export const updateUserProfile = createAsyncThunk("user/updateProfile", async (userData: userService.UpdateUserProfile, { rejectWithValue }) => {
  try {
    const user = await userService.updateUserProfile(userData);
    return user;
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    return rejectWithValue(message)
  }
})

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logoutUser: state => {
      authService.logout()
      state.user = null
      state.token = null
      state.isAuthenticated = false
    },
  },
  extraReducers: builder => {
    builder
      .addCase(loginUser.pending, state => {
        state.loading = true
        state.error = null
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false
        state.token = action.payload
        state.isAuthenticated = true
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
      .addCase(registerUser.pending, state => {
        state.loading = true
        state.error = null
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false
        state.token = action.payload
        state.isAuthenticated = true
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
      .addCase(checkAuth.fulfilled, (state, action) => {
        state.user = action.payload
        state.isAuthenticated = true
      })
      .addCase(checkAuth.rejected, state => {
        authService.logout()
        state.user = null
        state.isAuthenticated = false
      })
      .addCase(deleteUserAccount.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteUserAccount.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(deleteUserAccount.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(updateUserProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateUserProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(updateUserProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
  },
})

export const { logoutUser } = authSlice.actions
export default authSlice.reducer
