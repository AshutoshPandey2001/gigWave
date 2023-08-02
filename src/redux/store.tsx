import { configureStore } from '@reduxjs/toolkit'
import userReducer from './action/Auth/authAction'
import userTypeReducer from './action/User/userTypeSlice'

export const store = configureStore({
  reducer: {
    user: userReducer,
    userType: userTypeReducer,
    isListView: userTypeReducer
  }
})

export type RootState = ReturnType<typeof store.getState>

export type AppDispatch = typeof store.dispatch


