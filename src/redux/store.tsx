import { configureStore } from '@reduxjs/toolkit'
import userReducer from './action/Auth/authAction'
import userTypeReducer from './action/User/userTypeSlice'

export const store = configureStore({
  reducer: {
    firstToken:userReducer,
    user: userReducer,
    userType: userTypeReducer,
    isListView: userTypeReducer,
    isCreateButton:userTypeReducer
  }
})

export type RootState = ReturnType<typeof store.getState>

export type AppDispatch = typeof store.dispatch


