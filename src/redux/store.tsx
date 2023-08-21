import AsyncStorage from '@react-native-async-storage/async-storage';
import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { FLUSH, PAUSE, PERSIST, PURGE, REGISTER, REHYDRATE, persistReducer } from 'redux-persist';
import userReducer from './action/Auth/authAction';
import uiReducer from './action/General/GeneralSlice';
import userTypeReducer from './action/User/userTypeSlice';
const rootReducer = combineReducers({
  firstToken: userReducer,
  user: userReducer,
  userType: userTypeReducer,
  isListView: userTypeReducer,
  isCreateButton: userTypeReducer,
  isLoading: uiReducer  // Add other slice reducers here
});

const persistConfig = {
  key: 'root', // key for AsyncStorage
  storage: AsyncStorage,
  whitelist: ['user'],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
})

export type RootState = ReturnType<typeof store.getState>

export type AppDispatch = typeof store.dispatch


